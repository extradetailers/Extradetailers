from django.db import models
from services.models import Service, VehicleType, ServicePrice, AddOnService
from accounts.models import User, Location




# Create your models here.
class Booking(models.Model):
    # user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="customer_bookings",
        limit_choices_to={'role': 'customer'}  # Enforce role
    )
    detailer = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_jobs",
        limit_choices_to={'role': 'detailer'}  # Enforce role
    )
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True, related_name="bookings")
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="orders")
    # service_price = models.ForeignKey(ServicePrice, on_delete=models.CASCADE, related_name='bookings')
    service_price = models.ForeignKey(ServicePrice, on_delete=models.CASCADE, related_name='bookings')
    vehicle_type = models.ForeignKey(VehicleType, on_delete=models.CASCADE)
    booking_date = models.CharField(null=False, blank=False)
    slot=models.CharField(null=True, blank=True) # Time slot
    status = models.CharField(
        max_length=20,
        choices=[("initialized", "Initialized"), ("pending", "Pending"), ("completed", "Completed"), ("canceled", "Canceled")],
        default="initialized"
    )
    payment_intent_id = models.CharField(max_length=255, null=True, blank=True)  # New field
    paid = models.BooleanField(default=False)  # ✅ New field
    notes = models.TextField(blank=True, null=True)

    # 🔥 New many-to-many field
    addons = models.ManyToManyField(AddOnService, blank=True, related_name="bookings")

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"
