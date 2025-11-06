'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Lock, Mail, Globe, Clock } from "lucide-react";

export default function VendorSettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isVendor, vendor } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    bookingAlerts: true,
    messageAlerts: true,
    reviewAlerts: true,
    profileVisibility: "public",
    autoAcceptBookings: false,
    businessHours: "9am-5pm",
    timezone: "IST",
    currency: "INR",
  });

  useEffect(() => {
    if (!isAuthenticated || !isVendor) {
      router.push("/");
    }
  }, [isAuthenticated, isVendor, router]);

  if (!isAuthenticated || !isVendor) {
    return null;
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    // TODO: Implement settings save functionality
    console.log("Settings saved:", settings);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account preferences</p>
        </div>
        <Button onClick={handleSaveSettings}>Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose what updates you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Bell className="w-4 h-4 mr-2" />
                  Email Notifications
                </Label>
                <p className="text-sm text-gray-500">Receive email updates about your account</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Booking Alerts</Label>
                <p className="text-sm text-gray-500">Get notified about new bookings</p>
              </div>
              <Switch
                checked={settings.bookingAlerts}
                onCheckedChange={(checked) => handleSettingChange("bookingAlerts", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Message Alerts</Label>
                <p className="text-sm text-gray-500">Get notified about new messages</p>
              </div>
              <Switch
                checked={settings.messageAlerts}
                onCheckedChange={(checked) => handleSettingChange("messageAlerts", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Review Alerts</Label>
                <p className="text-sm text-gray-500">Get notified about new reviews</p>
              </div>
              <Switch
                checked={settings.reviewAlerts}
                onCheckedChange={(checked) => handleSettingChange("reviewAlerts", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Visibility */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy & Visibility</CardTitle>
            <CardDescription>Control your profile visibility and booking settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Profile Visibility
                </Label>
                <p className="text-sm text-gray-500">Control who can see your business profile</p>
              </div>
              <Select
                value={settings.profileVisibility}
                onValueChange={(value) => handleSettingChange("profileVisibility", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="registered">Registered Users Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-accept Bookings</Label>
                <p className="text-sm text-gray-500">Automatically accept booking requests</p>
              </div>
              <Switch
                checked={settings.autoAcceptBookings}
                onCheckedChange={(checked) => handleSettingChange("autoAcceptBookings", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Business Settings</CardTitle>
            <CardDescription>Configure your business operation settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Business Hours
                </Label>
                <p className="text-sm text-gray-500">Set your standard business hours</p>
              </div>
              <Select
                value={settings.businessHours}
                onValueChange={(value) => handleSettingChange("businessHours", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select hours" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9am-5pm">9 AM - 5 PM</SelectItem>
                  <SelectItem value="10am-6pm">10 AM - 6 PM</SelectItem>
                  <SelectItem value="11am-7pm">11 AM - 7 PM</SelectItem>
                  <SelectItem value="custom">Custom Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Time Zone</Label>
                <p className="text-sm text-gray-500">Set your business time zone</p>
              </div>
              <Select
                value={settings.timezone}
                onValueChange={(value) => handleSettingChange("timezone", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IST">India (IST)</SelectItem>
                  <SelectItem value="GMT">London (GMT)</SelectItem>
                  <SelectItem value="EST">New York (EST)</SelectItem>
                  <SelectItem value="PST">Los Angeles (PST)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Currency</Label>
                <p className="text-sm text-gray-500">Set your preferred currency</p>
              </div>
              <Select
                value={settings.currency}
                onValueChange={(value) => handleSettingChange("currency", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="GBP">British Pound (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
