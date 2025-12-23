# Create your models here.
from django.db import models


# To group services: Exterior, Interior, Full-Service, Add-Ons, Specialty, etc.
class ServiceCategory(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class VehicleType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

# For Sedan, Small SUV, Large SUV/Truck — since prices vary by type.
class Service(models.Model):
    title = models.CharField(max_length=255)
    category = models.ForeignKey(ServiceCategory, on_delete=models.CASCADE, related_name='services')
    description = models.TextField()
    estimated_time_min = models.PositiveIntegerField()
    estimated_time_max = models.PositiveIntegerField()

    def __str__(self):
        return self.title


# Since each service has different prices based on vehicle type.
class ServicePrice(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='prices')
    vehicle_type = models.ForeignKey(VehicleType, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=7, decimal_places=2)

    def __str__(self):
        return f"{self.service.title} - {self.vehicle_type.name}"


# Features like "Hand wash & dry", "Steam cleaning", "Bug & tar removal"
class ServiceFeature(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='features')
    feature_description = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.service.title} - {self.feature_description}"


# Standalone add-on services like "Ceramic Coating", "Ozone Treatment"
class AddOnService(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price_min = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    price_max = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    category = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name
