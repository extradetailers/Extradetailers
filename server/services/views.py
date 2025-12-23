from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import (
    Service, ServiceCategory, VehicleType,
    ServicePrice, ServiceFeature, AddOnService
)
from .serializers import (
    ServiceSerializer, ServiceCategorySerializer, VehicleTypeSerializer, ServiceCreateSerializer,
    ServicePriceSerializer, ServiceFeatureSerializer, AddOnServiceSerializer,
    FullDataSerializer, CombinedServicesSerializer, PopulatedServiceSerializer, PopulatedAddOnServiceSerializer
)
from accounts.mixins import PublicPermissionMixin, AdminPermissionMixin

# Service Views (you already have these)
class ServiceListView(PublicPermissionMixin, generics.ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class ServiceCreateView(AdminPermissionMixin, generics.CreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceCreateSerializer

class ServiceRetrieveView(PublicPermissionMixin, generics.RetrieveAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class ServiceUpdateView(AdminPermissionMixin, generics.UpdateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class ServiceDeleteView(AdminPermissionMixin, generics.DestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

# ServiceCategory Views
class ServiceCategoryListView(PublicPermissionMixin, generics.ListAPIView):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer

class ServiceCategoryCreateView(AdminPermissionMixin, generics.CreateAPIView):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer

class ServiceCategoryRetrieveView(PublicPermissionMixin, generics.RetrieveAPIView):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer

class ServiceCategoryUpdateView(AdminPermissionMixin, generics.UpdateAPIView):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer

class ServiceCategoryDeleteView(AdminPermissionMixin, generics.DestroyAPIView):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer

# VehicleType Views
class VehicleTypeListView(PublicPermissionMixin, generics.ListAPIView):
    queryset = VehicleType.objects.all()
    serializer_class = VehicleTypeSerializer

class VehicleTypeCreateView(AdminPermissionMixin, generics.CreateAPIView):
    queryset = VehicleType.objects.all()
    serializer_class = VehicleTypeSerializer

class VehicleTypeRetrieveView(PublicPermissionMixin, generics.RetrieveAPIView):
    queryset = VehicleType.objects.all()
    serializer_class = VehicleTypeSerializer

class VehicleTypeUpdateView(AdminPermissionMixin, generics.UpdateAPIView):
    queryset = VehicleType.objects.all()
    serializer_class = VehicleTypeSerializer

class VehicleTypeDeleteView(AdminPermissionMixin, generics.DestroyAPIView):
    queryset = VehicleType.objects.all()
    serializer_class = VehicleTypeSerializer

# ServicePrice Views
class ServicePriceListView(PublicPermissionMixin, generics.ListAPIView):
    queryset = ServicePrice.objects.all()
    serializer_class = ServicePriceSerializer

class ServicePriceCreateView(AdminPermissionMixin, generics.CreateAPIView):
    queryset = ServicePrice.objects.all()
    serializer_class = ServicePriceSerializer

class ServicePriceRetrieveView(PublicPermissionMixin, generics.RetrieveAPIView):
    queryset = ServicePrice.objects.all()
    serializer_class = ServicePriceSerializer

class ServicePriceUpdateView(AdminPermissionMixin, generics.UpdateAPIView):
    queryset = ServicePrice.objects.all()
    serializer_class = ServicePriceSerializer

class ServicePriceDeleteView(AdminPermissionMixin, generics.DestroyAPIView):
    queryset = ServicePrice.objects.all()
    serializer_class = ServicePriceSerializer

# ServiceFeature Views
class ServiceFeatureListView(PublicPermissionMixin, generics.ListAPIView):
    queryset = ServiceFeature.objects.all()
    serializer_class = ServiceFeatureSerializer

class ServiceFeatureCreateView(AdminPermissionMixin, generics.CreateAPIView):
    queryset = ServiceFeature.objects.all()
    serializer_class = ServiceFeatureSerializer

class ServiceFeatureRetrieveView(PublicPermissionMixin, generics.RetrieveAPIView):
    queryset = ServiceFeature.objects.all()
    serializer_class = ServiceFeatureSerializer

class ServiceFeatureUpdateView(AdminPermissionMixin, generics.UpdateAPIView):
    queryset = ServiceFeature.objects.all()
    serializer_class = ServiceFeatureSerializer

class ServiceFeatureDeleteView(AdminPermissionMixin, generics.DestroyAPIView):
    queryset = ServiceFeature.objects.all()
    serializer_class = ServiceFeatureSerializer

# AddOnService Views
class AddOnServiceListView(PublicPermissionMixin, generics.ListAPIView):
    queryset = AddOnService.objects.all()
    serializer_class = AddOnServiceSerializer

class AddOnServiceCreateView(AdminPermissionMixin, generics.CreateAPIView):
    queryset = AddOnService.objects.all()
    serializer_class = AddOnServiceSerializer

class AddOnServiceRetrieveView(PublicPermissionMixin, generics.RetrieveAPIView):
    queryset = AddOnService.objects.all()
    serializer_class = AddOnServiceSerializer

class AddOnServiceUpdateView(AdminPermissionMixin, generics.UpdateAPIView):
    queryset = AddOnService.objects.all()
    serializer_class = AddOnServiceSerializer

class AddOnServiceDeleteView(AdminPermissionMixin, generics.DestroyAPIView):
    queryset = AddOnService.objects.all()
    serializer_class = AddOnServiceSerializer


# Custom Views
class FullDataView(PublicPermissionMixin, APIView):
    serializer_class = FullDataSerializer

    def get(self, request, *args, **kwargs):
        services = Service.objects.prefetch_related(
            'features',
            'prices',
            'prices__vehicle_type'
        ).select_related('category')

        addon_services = AddOnService.objects.select_related('category')
        vehicle_types = VehicleType.objects.all()
        service_categories = ServiceCategory.objects.all()
        service_prices = ServicePrice.objects.select_related('vehicle_type', 'service')
        service_features = ServiceFeature.objects.select_related('service')

        response_data = {
            "services": PopulatedServiceSerializer(services, many=True).data,
            "addon_services": PopulatedAddOnServiceSerializer(addon_services, many=True).data,
            "vehicle_types": VehicleTypeSerializer(vehicle_types, many=True).data,
            "service_categories": ServiceCategorySerializer(service_categories, many=True).data,
            "service_prices": ServicePriceSerializer(service_prices, many=True).data,
            "service_features": ServiceFeatureSerializer(service_features, many=True).data,
        }

        return Response(response_data)


class CombinedServicesView(PublicPermissionMixin, APIView):
    serializer_class = CombinedServicesSerializer

    def get(self, request, *args, **kwargs):
        services = Service.objects.prefetch_related(
            'features',
            'prices',
            'prices__vehicle_type'
        ).select_related('category').all()

        addon_services = AddOnService.objects.select_related('category').all()
        vehicle_types = VehicleType.objects.all()

        response_data = {
            "services": PopulatedServiceSerializer(services, many=True).data,
            "addon_services": PopulatedAddOnServiceSerializer(addon_services, many=True).data,
            "vehicle_types": VehicleTypeSerializer(vehicle_types, many=True).data,
        }

        return Response(response_data)




