from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Location

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        exclude = ['password']  # Exclude sensitive field


# Creating user by admin
class UserCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        # exclude = ['username']

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name', 'role',
            'is_validated', 'is_admin', 'is_active',
            'is_staff', 'is_superuser', 'username',
            'groups', 'user_permissions'
        ]
        extra_kwargs = {
            field: {'required': False} for field in fields
        }

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserValidationSerializer(serializers.Serializer):
    token = serializers.CharField()

    def validate(self, attrs):
        token = attrs.get("token")
        try:
            decoded_token = RefreshToken(token)  # Decode JWT
            user_id = decoded_token['user_id']
            user = User.objects.get(id=user_id)
            if user.is_validated:
                raise serializers.ValidationError("User already validated.")
            user.is_validated = True
            user.save()
            return {"message": "User successfully validated"}
        except Exception:
            raise serializers.ValidationError("Invalid or expired token")


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class EmptySerializer(serializers.Serializer):
    pass  # No fields, just to satisfy DRF


class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = "__all__"
