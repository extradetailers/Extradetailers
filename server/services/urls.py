from django.urls import path
from .views import (
    ServiceListView, ServiceCreateView, ServiceRetrieveView, ServiceUpdateView, ServiceDeleteView,
    ServiceCategoryListView, ServiceCategoryCreateView, ServiceCategoryRetrieveView,
    ServiceCategoryUpdateView, ServiceCategoryDeleteView,
    VehicleTypeListView, VehicleTypeCreateView, VehicleTypeRetrieveView,
    VehicleTypeUpdateView, VehicleTypeDeleteView,
    ServicePriceListView, ServicePriceCreateView, ServicePriceRetrieveView,
    ServicePriceUpdateView, ServicePriceDeleteView,
    ServiceFeatureListView, ServiceFeatureCreateView, ServiceFeatureRetrieveView,
    ServiceFeatureUpdateView, ServiceFeatureDeleteView,
    AddOnServiceListView, AddOnServiceCreateView, AddOnServiceRetrieveView,
    AddOnServiceUpdateView, AddOnServiceDeleteView, FullDataView, CombinedServicesView
)

urlpatterns = [
    # Service URLs
    path('main/', ServiceListView.as_view()),
    path('main/create/', ServiceCreateView.as_view()),
    path('main/<int:pk>/', ServiceRetrieveView.as_view()),
    path('main/<int:pk>/update/', ServiceUpdateView.as_view()),
    path('main/<int:pk>/delete/', ServiceDeleteView.as_view()),

    # ServiceCategory URLs
    path('categories/', ServiceCategoryListView.as_view()),
    path('categories/create/', ServiceCategoryCreateView.as_view()),
    path('categories/<int:pk>/', ServiceCategoryRetrieveView.as_view()),
    path('categories/<int:pk>/update/', ServiceCategoryUpdateView.as_view()),
    path('categories/<int:pk>/delete/', ServiceCategoryDeleteView.as_view()),

    # VehicleType URLs
    path('vehicle-types/', VehicleTypeListView.as_view()),
    path('vehicle-types/create/', VehicleTypeCreateView.as_view()),
    path('vehicle-types/<int:pk>/', VehicleTypeRetrieveView.as_view()),
    path('vehicle-types/<int:pk>/update/', VehicleTypeUpdateView.as_view()),
    path('vehicle-types/<int:pk>/delete/', VehicleTypeDeleteView.as_view()),

    # ServicePrice URLs
    path('prices/', ServicePriceListView.as_view()),
    path('prices/create/', ServicePriceCreateView.as_view()),
    path('prices/<int:pk>/', ServicePriceRetrieveView.as_view()),
    path('prices/<int:pk>/update/', ServicePriceUpdateView.as_view()),
    path('prices/<int:pk>/delete/', ServicePriceDeleteView.as_view()),

    # ServiceFeature URLs
    path('features/', ServiceFeatureListView.as_view()),
    path('features/create/', ServiceFeatureCreateView.as_view()),
    path('features/<int:pk>/', ServiceFeatureRetrieveView.as_view()),
    path('features/<int:pk>/update/', ServiceFeatureUpdateView.as_view()),
    path('features/<int:pk>/delete/', ServiceFeatureDeleteView.as_view()),

    # AddOnService URLs
    path('addons/', AddOnServiceListView.as_view()),
    path('addons/create/', AddOnServiceCreateView.as_view()),
    path('addons/<int:pk>/', AddOnServiceRetrieveView.as_view()),
    path('addons/<int:pk>/update/', AddOnServiceUpdateView.as_view()),
    path('addons/<int:pk>/delete/', AddOnServiceDeleteView.as_view()),

    path('full-data/', FullDataView.as_view()),
    path('combined-data/', CombinedServicesView.as_view()),

]