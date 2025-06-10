import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSettingsPage() {
  return (
    <div
      className="animate-slide-in"
      style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold font-headline text-center sm:text-left">
          Settings
        </h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl md:text-2xl">
              General Settings
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Manage general site settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName" className="text-sm">
                Site Name
              </Label>
              <Input
                id="siteName"
                defaultValue="MarketPulse"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription" className="text-sm">
                Site Description
              </Label>
              <Input
                id="siteDescription"
                defaultValue="Your daily lens on the Share Market."
                className="text-sm"
              />
            </div>
            <Button disabled size="sm">
              Save Changes
            </Button>{" "}
            {/* Disabled */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl md:text-2xl">
              Theme Settings
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Customize the appearance of the site (placeholders).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Theme customization options would go here.
            </p>
            <Button variant="outline" disabled size="sm">
              Reset to Defaults
            </Button>{" "}
            {/* Disabled */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl md:text-2xl">
              API Keys
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Manage API keys for integrations (placeholders).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newsApiKey" className="text-sm">
                News API Key
              </Label>
              <Input
                id="newsApiKey"
                type="password"
                placeholder="Enter your News API key"
                className="text-sm"
              />
            </div>
            <Button disabled size="sm">
              Save API Keys
            </Button>{" "}
            {/* Disabled */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
