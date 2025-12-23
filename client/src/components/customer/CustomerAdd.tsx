import React from "react";
import { IUser } from "@/types";
import { FaUser, FaEnvelope, FaUserShield, FaUsersCog } from "react-icons/fa";
import { userBoolFields } from "@/utils/staticData";

interface IUserAddProps {
  selectedUser?: IUser | null;
  roles: string[];
  groups: { id: number; name: string }[];
  permissions: { id: number; name: string }[];
}

const UserAdd: React.FC<IUserAddProps> = ({
  selectedUser,
  roles,
  groups,
  permissions,
}) => {
  return (
    <React.Fragment>
      {/* First and Last Name */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="firstName" className="form-label fw-semibold">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="first_name"
            className="form-control"
            placeholder="John"
            defaultValue={selectedUser?.first_name || ""}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="lastName" className="form-label fw-semibold">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="last_name"
            className="form-control"
            placeholder="Doe"
            defaultValue={selectedUser?.last_name || ""}
            required
          />
        </div>
      </div>

      {/* Email and Username */}
      <div className="mb-3">
        <label htmlFor="email" className="form-label fw-semibold">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-control"
          placeholder="john@example.com"
          defaultValue={selectedUser?.email || ""}
          required
        />
      </div>

      {/* Password and Confirm Password (only for new users) */}
      {!selectedUser && (
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="confirmPassword" className="form-label fw-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirm_password"
              className="form-control"
              placeholder="Confirm password"
              required
            />
          </div>
        </div>
      )}

      {/* Role */}
      <div className="mb-3">
        <label
          htmlFor="role"
          className="form-label fw-semibold d-flex align-items-center"
        >
          <FaUserShield className="me-2" />
          Role
        </label>
        <select
          id="role"
          name="role"
          className="form-select border-primary"
          defaultValue={selectedUser?.role || ""}
          required
        >
          <option value="">-- Select Role --</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Boolean Switches */}
      <div className="row mb-3">
        {userBoolFields.map((item, index) => (
          <div className="col-md-4 mb-2" key={index}>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id={item}
                name={item}
                defaultChecked={
                  Boolean(selectedUser?.[item as keyof IUser]) || false
                }
              />
              <label className="form-check-label" htmlFor={item}>
                {item}
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Groups */}
      <div className="mb-3">
        <label
          htmlFor="groups"
          className="form-label fw-semibold d-flex align-items-center"
        >
          <FaUsersCog className="me-2" />
          Groups
        </label>
        <select
          id="groups"
          name="groups"
          className="form-select border-primary"
          multiple
          defaultValue={selectedUser?.groups.map(String) || []}
        >
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        <div className="form-text">
          Hold Ctrl (Windows) or Cmd (Mac) to select multiple
        </div>
      </div>

      {/* Permissions */}
      <div className="mb-4">
        <label htmlFor="permissions" className="form-label fw-semibold">
          User Permissions
        </label>
        <select
          id="permissions"
          name="user_permissions"
          className="form-select border-primary"
          multiple
          defaultValue={selectedUser?.user_permissions.map(String) || []}
        >
          {permissions.map((perm) => (
            <option key={perm.id} value={perm.id}>
              {perm.name}
            </option>
          ))}
        </select>
      </div>

      {/* Readonly fields */}
      {selectedUser && (
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Date Joined</label>
            <input
              type="text"
              className="form-control"
              readOnly
              value={new Date(selectedUser.date_joined).toLocaleString()}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Last Login</label>
            <input
              type="text"
              className="form-control"
              readOnly
              value={
                selectedUser.last_login
                  ? new Date(selectedUser.last_login).toLocaleString()
                  : "Never"
              }
            />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default UserAdd;
