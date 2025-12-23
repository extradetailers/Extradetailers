from rest_framework import generics
from .models import Booking
from .serializers import BookingSerializer, BookingPopulatedSerializer, BookingUpdateSerializer
from accounts.mixins import CustomerPermissionMixin, GeneralUserPermissionMixin, AdminPermissionMixin


class BookingListView(GeneralUserPermissionMixin, generics.ListAPIView):
    serializer_class = BookingPopulatedSerializer

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Booking.objects.none()

        if user.role == "admin":
            return Booking.objects.all()

        elif user.role == "customer":
            return Booking.objects.filter(customer=user)

        elif user.role == "detailer":
            return Booking.objects.filter(detailer=user)

        return Booking.objects.none()



# Create a new booking (User can only create for themselves)
class BookingCreateView(CustomerPermissionMixin, generics.CreateAPIView):
    serializer_class = BookingSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Set user automatically


# Retrieve a specific booking (User can only retrieve their own bookings)
class BookingRetrieveView(GeneralUserPermissionMixin, generics.RetrieveAPIView):
    serializer_class = BookingSerializer

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)  # Only user's bookings


# Update a specific booking (User can only update their own bookings)
class BookingUpdateView(AdminPermissionMixin, generics.UpdateAPIView):
    serializer_class = BookingUpdateSerializer
    lookup_field = "pk"

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Booking.objects.all()
        return Booking.objects.filter(customer=self.request.user)



# Delete a specific booking (User can only delete their own bookings)
class BookingDeleteView(AdminPermissionMixin, generics.DestroyAPIView):
    serializer_class = BookingSerializer

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)  # Only user's bookings

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)  # Only user's orders
