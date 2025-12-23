import os
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from .models import User, Location
from .serializers import UserRegistrationSerializer, UserValidationSerializer, LoginSerializer, EmptySerializer, ForgotPasswordSerializer, UserSerializer, UserCreationSerializer, UserUpdateSerializer, LocationSerializer, ResetPasswordSerializer
from .mixins import PublicPermissionMixin, GeneralUserPermissionMixin, CustomerPermissionMixin, DetailerPermissionMixin, AdminPermissionMixin
from utils.keys import REFRESH_TOKEN_LIFETIME_IN_DAYS, ACCESS_TOKEN_LIFETIME_IN_MINUTES
from utils.send_email import send_transactional_email

# Validate COOKIE_HTTP_ONLY, COOKIE_SECURE, and COOKIE_SAMESITE
COOKIE_HTTP_ONLY = os.getenv("HTTP_ONLY", "false").lower() == "true"
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"
COOKIE_SAMESITE = os.getenv("COOKIE_SAMESITE", "None").lower() if os.getenv("COOKIE_SAMESITE") else None
# 30 minutes
COOKIE_ACCESS_TOKEN_AGE = 60 * ACCESS_TOKEN_LIFETIME_IN_MINUTES
# 7 Days
COOKIE_REFRESH_TOKEN_AGE = 60 * 60 * 24 * REFRESH_TOKEN_LIFETIME_IN_DAYS


# Helper to convert checkbox/form strings to bool
def to_bool(value):
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.lower() in ['true', '1', 'on', 'yes']
    return False


class UserSignupView(PublicPermissionMixin, generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        email = request.data.get('email')

        # Check if user already exists but is not validated
        user = User.objects.filter(email=email).first()


        if user:
            if not user.is_validated:
                # Generate a new validation token
                token = RefreshToken.for_user(user)

                # Resend Validation Email

                

                try:
                    validation_link = f"{os.getenv('FRONTEND_URL')}/auth/validate-user/?token={str(token.access_token)}"
                    html_message = f"""
                        <html>
                            <body>
                                <h2>Welcome!</h2>
                                <p>Click the link below to verify your account:</p>
                                <a href="{validation_link}">Verify Account</a>
                            </body>
                        </html>
                    """
                    send_transactional_email(user.email, "Validate Your Account", html_message)
                except Exception as e:
                    return Response({"error": "User created but failed to send validation email."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


                return Response(
                    {"message": "User already exists but is not validated. A new validation email has been sent."},
                    status=status.HTTP_200_OK
                )
            else:
                return Response({"error": "User with this email already exists and is validated."}, status=status.HTTP_400_BAD_REQUEST)

        # If user does not exist, proceed with signup
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(email=response.data['email'])

        # Generate JWT Token
        token = RefreshToken.for_user(user)

        # Send Validation Email
        validation_link = f"{os.getenv('FRONTEND_URL')}/auth/validate-user/?token={str(token.access_token)}"
        html_message = f"""
                                <html>
                                    <body>
                                        <h2>Welcome!</h2>
                                        <p>Click the link below to verify your account:</p>
                                        <a href="{validation_link}">Verify Account</a>
                                    </body>
                                </html>
                            """
        send_transactional_email(user.email, "Validate Your Account", html_message)

        return Response(
            {"message": "User registered successfully. Check your email for validation link."},
            status=status.HTTP_201_CREATED
        )

# Unlike signup, it needs admin permission and this can create any kind of user
class CreateUserView(AdminPermissionMixin, generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreationSerializer

    def create(self, request, *args, **kwargs):
        email = request.data.get('email')

        user = User.objects.filter(email=email).first()

        if user and user.is_validated:
            return Response(
                {"error": "User with this email already exists and is validated."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Copy the request data so we can modify it
        mutable_data = request.data.copy()


        # Parse booleans from input or set defaults
        mutable_data['is_validated'] = to_bool(mutable_data.get('is_validated', False))
        mutable_data['is_active'] = to_bool(mutable_data.get('is_active', True))  # e.g. active by default
        mutable_data['is_admin'] = to_bool(mutable_data.get('is_admin', False))
        mutable_data['is_staff'] = to_bool(mutable_data.get('is_staff', False))
        mutable_data['is_superuser'] = to_bool(mutable_data.get('is_superuser', False))

        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(
            {"message": "User created successfully."},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

class UpdateUserView(AdminPermissionMixin, generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    lookup_field = 'pk'  # Adjust to 'id' or 'uuid' if needed

    def update(self, request, *args, **kwargs):
        # Copy and safely convert booleans from incoming data
        mutable_data = request.data.copy()

        # Handle optional boolean fields
        for field in ['is_validated', 'is_active', 'is_admin', 'is_staff', 'is_superuser']:
            if field in mutable_data:
                mutable_data[field] = to_bool(mutable_data.get(field))

        partial = kwargs.pop('partial', True)  # Allow partial update by default
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=mutable_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response({"message": "User updated successfully."}, status=status.HTTP_200_OK)

# Location start
class LocationCreateView(GeneralUserPermissionMixin, generics.CreateAPIView):
    serializer_class = LocationSerializer

    def perform_create(self, serializer):
        # If admin, allow user to be specified in serializer (if provided), else default to request.user
        if self.request.user.role == 'admin':
            # Admin can set user explicitly, so don't override user here
            serializer.save()
        else:
            # Normal users can only create locations for themselves
            serializer.save(user=self.request.user)

class LocationListView(GeneralUserPermissionMixin, generics.ListAPIView):
    serializer_class = LocationSerializer

    def get_queryset(self):
        if self.request.user.role == 'admin':
            # Admin sees all locations
            return Location.objects.all()
        else:
            # Others only see their own
            return Location.objects.filter(user=self.request.user)

class LocationDetailView(GeneralUserPermissionMixin, generics.RetrieveAPIView):
    serializer_class = LocationSerializer

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Location.objects.all()
        else:
            return Location.objects.filter(user=self.request.user)

class LocationUpdateView(GeneralUserPermissionMixin, generics.UpdateAPIView):
    serializer_class = LocationSerializer

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Location.objects.all()
        else:
            return Location.objects.filter(user=self.request.user)

class LocationDeleteView(GeneralUserPermissionMixin, generics.DestroyAPIView):
    serializer_class = LocationSerializer

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Location.objects.all()
        else:
            return Location.objects.filter(user=self.request.user)
# Location ends


class DeleteUserView(AdminPermissionMixin, generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreationSerializer  # Can be any serializer; not used for deletion
    lookup_field = 'pk'  # or 'id' or 'uuid'

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class ValidateUserView(PublicPermissionMixin, generics.CreateAPIView):
    serializer_class = EmptySerializer

    def create(self, request, *args, **kwargs):
        token = request.data.get("token")

        if not token:
            return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Decode the token
            decoded_token = AccessToken(token)

            # Get the user from the token
            user = User.objects.get(id=decoded_token["user_id"])

            # Validate the user
            user.is_validated = True
            user.save()

            return Response({"message": "User validated successfully"}, status=status.HTTP_200_OK)

        except AuthenticationFailed:
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(PublicPermissionMixin, generics.CreateAPIView):
    serializer_class = LoginSerializer  # Define a serializer for validation

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = authenticate(request, email=email, password=password)

        if user is None:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        response = Response({"message": "Login successful", "user_role": user.role, "access_token": access, "refresh_token": str(refresh)}, status=status.HTTP_200_OK)

        # Set cookies with HttpOnly & Secure flags
        response.set_cookie(
            key="access_token",
            value=access,
            httponly=COOKIE_HTTP_ONLY,  # Prevent JavaScript access
            secure=COOKIE_SECURE,  # Use HTTPS
            samesite=COOKIE_SAMESITE,  # Allow cross-origin cookies, "None" requires HTTPS, use "Lax" for localhost
            max_age=COOKIE_ACCESS_TOKEN_AGE,  # 30 minutes
        )
        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=COOKIE_HTTP_ONLY,
            secure=COOKIE_SECURE,
            samesite=COOKIE_SAMESITE,
            max_age=COOKIE_REFRESH_TOKEN_AGE,  # 7 days
        )

        response.set_cookie(
            key="user_role",
            value=str(user.role),
            httponly=COOKIE_HTTP_ONLY,
            secure=COOKIE_SECURE,
            samesite=COOKIE_SAMESITE,
            max_age=COOKIE_REFRESH_TOKEN_AGE,  # 7 days
        )

        return response


class RefreshTokenView(PublicPermissionMixin, generics.CreateAPIView):
    serializer_class = EmptySerializer

    def create(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response({"error": "Refresh token missing"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Decode the refresh token
            refresh = RefreshToken(refresh_token)

            # Get user ID from the token payload
            user_id = refresh.payload.get("user_id")  # Default claim is "user_id"

            if not user_id:
                return Response({"error": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

            # Fetch the user instance from the database
            user = User.objects.get(id=user_id)

            # Blacklist the old refresh token (if enabled in SIMPLE_JWT settings)
            refresh.blacklist()

            # Create new refresh & access tokens
            new_refresh_token = RefreshToken.for_user(user)
            access_token = str(new_refresh_token.access_token)
            refresh_token_str = str(new_refresh_token)

            # Set new tokens in cookies
            response = Response({
                "access_token": access_token,
                "refresh_token": refresh_token_str
            }, status=status.HTTP_200_OK)

            response.set_cookie("access_token", access_token, httponly=COOKIE_HTTP_ONLY, secure=COOKIE_SECURE, samesite=COOKIE_SAMESITE, max_age=COOKIE_ACCESS_TOKEN_AGE)
            response.set_cookie("refresh_token", refresh_token_str, httponly=COOKIE_HTTP_ONLY, secure=COOKIE_SECURE, samesite=COOKIE_SAMESITE, max_age=COOKIE_REFRESH_TOKEN_AGE)

            return response
        except User.DoesNotExist:
            response = Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            response.delete_cookie('user_role')
            return response
        except AttributeError:
            response = Response({"error": "Invalid or expired refresh token"}, status=status.HTTP_401_UNAUTHORIZED)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            response.delete_cookie('user_role')
            return response
        except Exception as e:
            response = Response({"error": f"Invalid or expired refresh token: {str(e)}"}, status=status.HTTP_401_UNAUTHORIZED)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            response.delete_cookie('user_role')
            return response


class LogoutView(PublicPermissionMixin, generics.CreateAPIView):
    serializer_class = EmptySerializer

    def create(self, request, *args, **kwargs):
        response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

        # Delete authentication cookies
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        response.delete_cookie("user_role")

        return response


class ProtectedView(GeneralUserPermissionMixin, APIView):
    # Adding a dummy serializer_class here to bypass DRF's guess logic
    serializer_class = None

    def get(self, request):
        return Response({"message": "You are authenticated!"})


class ForgotPasswordView(PublicPermissionMixin, generics.CreateAPIView):
    serializer_class = ForgotPasswordSerializer

    def create(self, request, *args, **kwargs):
        email = request.data.get("email")

        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)

            # Check if there's an existing valid reset token (assuming tokens expire in 15 mins)
            existing_token = RefreshToken.for_user(user)
            existing_access_token = str(existing_token.access_token)

            reset_link = f"{os.getenv('FRONTEND_URL')}/reset-password/?token={existing_access_token}"

            # Send email with reset link
            html_message = f"""
                                    <html>
                                        <body>
                                            <h2>Welcome!</h2>
                                            <p>Click the link below to reset the password:</p>
                                            <a href="{reset_link}">Reset Password</a>
                                        </body>
                                    </html>
                                """
            send_transactional_email(email, "Reset Your Password", html_message)

            return Response({"message": "Password reset link sent to your email."}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(PublicPermissionMixin, generics.CreateAPIView):
    serializer_class = ResetPasswordSerializer

    def create(self, request, *args, **kwargs):
        token = request.data.get("token")
        new_password = request.data.get("password")

        if not token or not new_password:
            return Response({"error": "Token and new password are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_token = AccessToken(token)
            user = User.objects.get(id=decoded_token["user_id"])

            # Set new password
            user.set_password(new_password)
            user.save()

            return Response({"message": "Password has been reset successfully"}, status=status.HTTP_200_OK)

        except AuthenticationFailed:
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserListView(AdminPermissionMixin, generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        username = params.get('username')
        if username:
            queryset = queryset.filter(username=username)

        email = params.get('email')
        if email:
            queryset = queryset.filter(email=email)

        first_name = params.get('first_name')
        if first_name:
            queryset = queryset.filter(first_name__icontains=first_name)

        last_name = params.get('last_name')
        if last_name:
            queryset = queryset.filter(last_name__icontains=last_name)

        role = params.get('role')
        if role:
            queryset = queryset.filter(role=role)

        is_active = params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')

        is_validated = params.get('is_validated')
        if is_validated is not None:
            queryset = queryset.filter(is_validated=is_validated.lower() == 'true')

        return queryset
