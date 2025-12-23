import os
import django
import json
from datetime import timedelta
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.

######################
# Clean up location
# Booking
######################

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')  # Change if your settings module is different
django.setup()

from django.contrib.auth import get_user_model
from services.models import (
    ServiceCategory,
    VehicleType,
    Service,
    ServicePrice,
    ServiceFeature,
    AddOnService
)

# Delete all users




# Load the JSON data
def load_json_data():
    base_dir = Path(__file__).resolve().parent
    json_file = base_dir / 'services_data.json'

    with open(json_file, 'r') as f:
        return json.load(f)

# Function to delete existing data
def delete_existing_data():
    User = get_user_model()
    email = "mdshayon0@gmail.com"

    # Delete existing superuser
    existing_user = User.objects.filter(username=email).first()
    if existing_user:
        existing_user.delete()
        print(f"Deleted previous superuser: {email}")
    else:
        print(f"No superuser found with email {email}.")

    # Delete all existing data in reverse order of foreign key dependencies
    AddOnService.objects.all().delete()
    ServiceFeature.objects.all().delete()
    ServicePrice.objects.all().delete()
    Service.objects.all().delete()
    ServiceCategory.objects.all().delete()
    VehicleType.objects.all().delete()

    print("Deleted all existing service data.")

def create_superuser():
    # Uncomment the next line to delete data before running the rest of the operations
    delete_existing_data()
    User = get_user_model()
    email = "mdshayon0@gmail.com"

    if not User.objects.filter(username=email).exists():
        user = User.objects.create_superuser(
            username=email,
            email=email,
            password='Test1234',
            first_name="Md",
            last_name="Shayon"
        )
        user.is_active = True
        user.is_validated = True
        user.role = "admin"
        user.save()
        print(f"Superuser {email} created.")
    else:
        print(f"Superuser {email} already exists.")

def seed_vehicle_types(vehicle_types):
    for vt_data in vehicle_types:
        VehicleType.objects.get_or_create(name=vt_data['name'])
    print(f"Created {len(vehicle_types)} vehicle types.")

def seed_service_categories(categories):
    for cat_data in categories:
        ServiceCategory.objects.get_or_create(name=cat_data['name'])
    print(f"Created {len(categories)} service categories.")


def seed_services(services):
    for service_data in services:
        category = ServiceCategory.objects.get(name=service_data['category'])

        service, created = Service.objects.get_or_create(
            title=service_data['title'],
            defaults={
                'category': category,
                'description': service_data['description'],
                'estimated_time_min': service_data['estimated_time_min'],
                'estimated_time_max': service_data['estimated_time_max']
            }
        )

        if created:
            # Add prices
            for price_data in service_data['prices']:
                vehicle_type = VehicleType.objects.get(name=price_data['vehicle_type'])
                ServicePrice.objects.create(
                    service=service,
                    vehicle_type=vehicle_type,
                    price=price_data['price']
                )

            # Add features
            for feature_desc in service_data['features']:
                ServiceFeature.objects.create(
                    service=service,
                    feature_description=feature_desc
                )

            print(f"Created service: {service.title}")
        else:
            print(f"Service already exists: {service.title}")


def seed_add_on_services(add_ons):
    for add_on_data in add_ons:
        category = ServiceCategory.objects.get(name=add_on_data['category'])

        defaults = {
            'description': add_on_data['description'],
            'category': category
        }

        if 'price' in add_on_data:
            defaults['price_min'] = add_on_data['price']
            defaults['price_max'] = add_on_data['price']
        else:
            defaults['price_min'] = add_on_data['price_min']
            defaults['price_max'] = add_on_data['price_max']

        AddOnService.objects.get_or_create(
            name=add_on_data['name'],
            defaults=defaults
        )
    print(f"Created {len(add_ons)} add-on services.")


def run():
    # Uncomment to delete existing data first
    delete_existing_data()

    # Create superuser
    create_superuser()

    # Load JSON data
    data = load_json_data()

    # Seed vehicle types
    seed_vehicle_types(data['vehicle_types'])

    # Seed service categories
    seed_service_categories(data['service_categories'])

    # Seed main services
    seed_services(data['services'])

    # Seed add-on services
    seed_add_on_services(data['add_on_services'])

    print("Data seeding completed successfully.")


if __name__ == '__main__':
    run()






















# python seed_data.py


