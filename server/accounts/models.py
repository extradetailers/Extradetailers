from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractUser


# Add multiple location of customer, and select one location in the time of booking
# Add promo codes
# Create another user types, that is detailer -> Manually or automatically assign jobs to available detailers.
# Detailer -> Manage detailer availability, location, and ratings.
# Receive notifications for new job assignments.
# Accept or decline jobs.
# Track completed jobs and payment history.

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        extra_fields.setdefault('username', email)  # ✅ Ensure username doesn't break the constraint
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    is_validated = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    role = models.CharField(max_length=20, choices=[('admin', 'Admin'), ('customer', 'Customer'), ('detailer', 'Detailer')], default='customer')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser

class Location(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="locations")
    label = models.CharField(max_length=100) # e.g. Home, Work
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default="USA")
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.label} - {self.address_line1}, {self.city}"
