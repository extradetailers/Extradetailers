from rest_framework import serializers
from services.serializers import ServiceSerializer, ServicePriceSerializer, VehicleTypeSerializer, AddOnServiceSerializer
from .models import Booking
from services.models import Service, AddOnService, ServicePrice, VehicleType
from accounts.serializers import UserSerializer
from accounts.models import User


class BookingUpdateSerializer(serializers.ModelSerializer):
    addons = serializers.PrimaryKeyRelatedField(
        queryset=AddOnService.objects.all(), many=True, required=False
    )
    service = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(), required=False
    )
    service_price = serializers.PrimaryKeyRelatedField(
        queryset=ServicePrice.objects.all(), required=False
    )
    vehicle_type = serializers.PrimaryKeyRelatedField(
        queryset=VehicleType.objects.all(), required=False
    )
    booking_date = serializers.DateField(required=False)
    slot = serializers.CharField(required=False)
    detailer = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="detailer"), required=False, allow_null=True
    )

    class Meta:
        model = Booking
        fields = [
            "service",
            "booking_date",
            "slot",
            "service_price",
            "vehicle_type",
            "status",
            "addons",
            "detailer",  # Include detailer in updatable fields
        ]


class BookingSerializer(serializers.ModelSerializer):
    addons = serializers.PrimaryKeyRelatedField(
        queryset=AddOnService.objects.all(), many=True, required=False
    )
    service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all())
    service_price = serializers.PrimaryKeyRelatedField(queryset=ServicePrice.objects.all())
    vehicle_type = serializers.PrimaryKeyRelatedField(queryset=VehicleType.objects.all())


    class Meta:
        model = Booking
        fields = [
            "service",
            "booking_date",
            "slot",
            "service_price",
            "vehicle_type",
            "addons",
        ]

class BookingPopulatedSerializer(serializers.ModelSerializer):
    service = ServiceSerializer(read_only=True)
    service_price = ServicePriceSerializer(read_only=True)
    vehicle_type = VehicleTypeSerializer(read_only=True)
    addons = AddOnServiceSerializer(read_only=True, many=True)
    customer = UserSerializer(read_only=True)
    detailer = UserSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "customer",
            "detailer",
            "service",
            "booking_date",
            "slot",
            "status",
            "service_price",
            "vehicle_type",
            "addons",
        ]

