import { IUser, TModuleStyle } from "@/types";
import React from "react";
import { FaEdit, FaTrash, FaEnvelope, FaUser, FaUserShield, FaClock, FaUserCheck, FaUserTimes } from "react-icons/fa";
import { BsPersonVcard } from "react-icons/bs";
import { MdDateRange } from "react-icons/md";

interface IUserCardProps {
  user: IUser;
  styles: TModuleStyle;
  handleDeleteUser: (e: React.SyntheticEvent, userId: number) => void;
  setEditingUserId: (e: React.SyntheticEvent, userId: number) => void;
}

function formatDate(isoString?: string | null) {
  if (!isoString) return "Never";
  return new Date(isoString).toLocaleString();
}

function UserCard({
  user,
  styles,
  handleDeleteUser,
  setEditingUserId,
}: IUserCardProps) {
  return (
    <div className={`card shadow-sm border-0 mb-4 ${styles.userCard}`} key={user.id}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">
            <FaUser className="me-2 text-primary" />
            {user.first_name} {user.last_name}
          </h5>
          <span className="badge bg-secondary text-capitalize">
            <BsPersonVcard className="me-1" />
            {user.role}
          </span>
        </div>

        <ul className="list-unstyled small mb-3">
          <li className="mb-1">
            <FaEnvelope className="me-2 text-muted" />
            <strong>Email:</strong> {user.email}
          </li>
          <li className="mb-1">
            <FaUserShield className="me-2 text-muted" />
            <strong>Username:</strong> {user.username}
          </li>
          <li className="mb-1">
            <MdDateRange className="me-2 text-muted" />
            <strong>Date Joined:</strong> {formatDate(user.date_joined)}
          </li>
          <li className="mb-1">
            <FaClock className="me-2 text-muted" />
            <strong>Last Login:</strong> {formatDate(user.last_login)}
          </li>
          <li className="mb-1">
            <FaUserCheck className="me-2 text-success" />
            <strong>Validated:</strong> {user.is_validated ? "Yes" : "No"}
          </li>
          <li className="mb-1">
            <FaUserCheck className="me-2 text-success" />
            <strong>Active:</strong> {user.is_active ? "Yes" : "No"}
          </li>
          <li className="mb-1">
            <FaUserShield className="me-2 text-warning" />
            <strong>Staff:</strong> {user.is_staff ? "Yes" : "No"}
          </li>
          <li className="mb-1">
            <FaUserShield className="me-2 text-danger" />
            <strong>Superuser:</strong> {user.is_superuser ? "Yes" : "No"}
          </li>
        </ul>

        <div className="d-flex justify-content-end">
          <button
            className="btn btn-outline-primary btn-sm me-2"
            onClick={(e) => setEditingUserId(e, user.id!)}
          >
            <FaEdit className="me-1" />
            Edit
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={(e) => handleDeleteUser(e, user.id!)}
          >
            <FaTrash className="me-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
