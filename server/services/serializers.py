from rest_framework import serializers
from .models import ServiceCategory, VehicleType, Service, ServicePrice, ServiceFeature, AddOnService


class VehicleTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleType
        fields = '__all__'


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = '__all__'


class ServicePriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicePrice
        fields = '__all__'


class ServiceFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceFeature
        fields = '__all__'


class AddOnServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddOnService
        fields = '__all__'


class ServiceSerializer(serializers.ModelSerializer):
    prices = ServicePriceSerializer(many=True, read_only=True)
    features = ServiceFeatureSerializer(many=True, read_only=True)
    category = ServiceCategorySerializer(read_only=True)

    class Meta:
        model = Service
        fields = '__all__'

class ServiceCreateSerializer(serializers.ModelSerializer):
    prices = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=ServicePrice.objects.all()
    )
    features = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=ServiceFeature.objects.all()
    )

    class Meta:
        model = Service
        fields = [
            'id',
            'title',
            'category',
            'description',
            'estimated_time_min',
            'estimated_time_max',
            'prices',
            'features'
        ]

    def create(self, validated_data):
        prices = validated_data.pop('prices')
        features = validated_data.pop('features')

        service = Service.objects.create(**validated_data)

        # Reassign related prices and features to the new service
        for price in prices:
            price.service = service
            price.save()

        for feature in features:
            feature.service = service
            feature.save()

        return service



class FullDataSerializer(serializers.Serializer):
    services = ServiceSerializer(many=True)
    vehicle_types = VehicleTypeSerializer(many=True)
    service_categories = ServiceCategorySerializer(many=True)
    service_prices = ServicePriceSerializer(many=True)
    service_features = ServiceFeatureSerializer(many=True)
    addon_services = AddOnServiceSerializer(many=True)


class PopulatedAddOnServiceSerializer(serializers.ModelSerializer):
    category = ServiceCategorySerializer(read_only=True)

    class Meta:
        model = AddOnService
        fields = '__all__'

class PopulatedServiceSerializer(serializers.ModelSerializer):
    prices = ServicePriceSerializer(many=True, read_only=True)
    features = ServiceFeatureSerializer(many=True, read_only=True)
    category = ServiceCategorySerializer(read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'title', 'description', 'estimated_time_min',
            'estimated_time_max', 'category', 'features', 'prices'
        ]


class CombinedServicesSerializer(serializers.Serializer):
    services = PopulatedServiceSerializer(many=True)
    addon_services = PopulatedAddOnServiceSerializer(many=True)
    vehicle_types = VehicleTypeSerializer(many=True)
    service_categories = ServiceCategorySerializer(many=True)
