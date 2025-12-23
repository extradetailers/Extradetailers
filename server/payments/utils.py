from services.models import Service, ServicePrice, AddOnService
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist

def calculate_order_amount(bookings):
    """
    Calculate the total order amount in cents (for Stripe).
    """
    total_price = 0

    for booking in bookings:
        service_price = booking['service_price']  # already a model instance
        total_price += float(service_price.price)

        addon_objs = booking.get('addons', [])
        if addon_objs:
            addons_total = sum(float(addon.price_min) for addon in addon_objs)
            total_price += addons_total

    return int(total_price * 100)  # Stripe expects amount in cents
