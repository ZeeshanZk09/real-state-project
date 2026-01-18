"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Select,
  SelectItem,
  Avatar,
  Divider,
} from "@nextui-org/react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    skillLevel: "Buyer",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        firstName: session.user.firstName || "",
        lastName: session.user.lastName || "",
        email: session.user.email || "",
        location: (session.user as any).location || "",
        skillLevel: (session.user as any).skillLevel || "Buyer",
        phone: (session.user as any).phone || "",
        bio: (session.user as any).bio || "",
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // Update user profile
      await update({
        ...session?.user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        location: formData.location,
        skillLevel: formData.skillLevel,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your profile and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="md:col-span-1">
          <CardBody className="items-center text-center p-6">
            <Avatar
              src={session?.user?.image || undefined}
              className="w-24 h-24 mb-4"
              name={`${formData.firstName} ${formData.lastName}`}
            />
            <h3 className="text-xl font-semibold">
              {formData.firstName} {formData.lastName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {formData.email}
            </p>
            <p className="text-xs text-gray-500">
              Member since{" "}
              {new Date(
                session?.user?.emailVerified || Date.now(),
              ).toLocaleDateString()}
            </p>
          </CardBody>
        </Card>

        {/* Settings Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold">Profile Information</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  isRequired
                />
                <Input
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  isRequired
                />
              </div>

              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                isDisabled
              />

              <Input
                label="Location"
                placeholder="City, State"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />

              <Select
                label="I am a..."
                placeholder="Select your role"
                selectedKeys={[formData.skillLevel]}
                onChange={(e) => handleChange("skillLevel", e.target.value)}
              >
                <SelectItem key="Buyer" value="Buyer">
                  Buyer
                </SelectItem>
                <SelectItem key="Seller" value="Seller">
                  Seller
                </SelectItem>
                <SelectItem key="Advanced" value="Advanced">
                  Advanced Investor
                </SelectItem>
                <SelectItem key="Expert" value="Expert">
                  Real Estate Expert
                </SelectItem>
                <SelectItem key="Master" value="Master">
                  Master Agent
                </SelectItem>
              </Select>

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />

              <Divider className="my-4" />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="flat"
                  onPress={() => {
                    if (session?.user) {
                      setFormData({
                        firstName: session.user.firstName || "",
                        lastName: session.user.lastName || "",
                        email: session.user.email || "",
                        location: (session.user as any).location || "",
                        skillLevel: (session.user as any).skillLevel || "Buyer",
                        phone: (session.user as any).phone || "",
                        bio: (session.user as any).bio || "",
                      });
                    }
                  }}
                >
                  Reset
                </Button>
                <Button type="submit" color="primary" isLoading={loading}>
                  Save Changes
                </Button>
              </div>

              {success && (
                <div className="p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-sm">
                  ✓ Profile updated successfully!
                </div>
              )}
            </form>
          </CardBody>
        </Card>
      </div>

      {/* Additional Settings Sections */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Notifications</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Email notifications</span>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Property updates</span>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">New inquiries</span>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Privacy</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Show email publicly</span>
              <input type="checkbox" className="toggle" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Show phone publicly</span>
              <input type="checkbox" className="toggle" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Allow messages</span>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
