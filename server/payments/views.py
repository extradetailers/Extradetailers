import stripe
import os
from rest_framework import generics, status
from rest_framework.response import Response
from payments.utils import calculate_order_amount
from payments.serializers import PaymentIntentSerializer
from accounts.mixins import GeneralUserPermissionMixin, PublicPermissionMixin
from accounts.serializers import EmptySerializer
from accounts.models import User
from bookings.models import Booking  # Assuming app is `bookings`
from services.models import Service, VehicleType, AddOnService, ServicePrice


# Create your views here.
class CreatePaymentIntentView(GeneralUserPermissionMixin, generics.CreateAPIView):
    serializer_class = PaymentIntentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        bookings_data = serializer.validated_data['bookings']

        try:
            amount = calculate_order_amount(bookings=bookings_data)

            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency='usd',
                automatic_payment_methods={'enabled': True}
            )
            print("Payment Intent ID: ", intent['id'])

            for item in bookings_data:
                # These are already model instances
                service = item['service']
                vehicle_type = item['vehicle_type']
                service_price = item['service_price']
                booking_date = item['booking_date']
                slot = item['slot']
                addons = item.get('addons', [])

                booking = Booking.objects.create(
                    customer=request.user,
                    service=service,
                    service_price=service_price,
                    vehicle_type=vehicle_type,
                    slot=slot,
                    status='initialized',
                    paid=False,
                    payment_intent_id=intent['id'],
                    booking_date=booking_date
                )

                if addons:
                    booking.addons.set(addons)

            return Response({'clientSecret': intent['client_secret']}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)




# Webhook - https://dashboard.stripe.com/test/workbench/webhooks/create?events=payment_intent.succeeded
class StripeWebhookView(PublicPermissionMixin, generics.CreateAPIView):
    serializer_class = EmptySerializer
    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

        # Validate secret configuration
        if not endpoint_secret:
            return Response(
                {'error': 'Stripe webhook secret is not configured on the server.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Validate Stripe signature header
        if not sig_header:
            return Response(
                {'error': 'Missing Stripe Signature header'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify and parse Stripe event
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError as e:
            return Response(
                {'error': 'Invalid payload', 'details': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except stripe.error.SignatureVerificationError as e:
            return Response(
                {'error': 'Invalid Stripe signature', 'details': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': 'Unexpected error while verifying event', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Event type processing
        try:
            event_type = event['type']

            if event_type == 'charge.succeeded':
                charge_object = event['data']['object']
                payment_intent_id = charge_object['payment_intent']  # <-- Correct key here
                print("Payment Intent ID: ", payment_intent_id)

                bookings = Booking.objects.filter(payment_intent_id=payment_intent_id)

                # 🔍 Find an available detailer with no assigned (incomplete) bookings
                available_detailer = User.objects.filter(
                    role='detailer'
                ).exclude(
                    assigned_jobs__status__in=['initialized', 'pending']
                ).first()

                print(f"Bookings matched: {bookings.count()}")
                # Find a user with role detailer who do not have any other booking, assign that detailer to this booking
                # Update bookings
                updated_count = 0
                for booking in bookings:
                    booking.status = 'pending'
                    booking.paid = True
                    if available_detailer:
                        booking.detailer = available_detailer
                    booking.save()
                    updated_count += 1

                message = f'Payment succeeded — {updated_count} bookings updated.'
                if available_detailer:
                    message += f" Assigned detailer: {available_detailer.email}"
                else:
                    message += " No available detailer found."

                return Response({'message': message}, status=status.HTTP_200_OK)

            return Response(
                {'message': f'Unhandled event type: {event_type}'},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {'error': 'Error processing event', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
