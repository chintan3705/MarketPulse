import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSettingsPage() {
  return (
    <div className="animate-slide-in" style={{animationDelay: '0.1s', animationFillMode: 'backwards'}}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline">Settings</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage general site settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" defaultValue="MarketPulse" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Input id="siteDescription" defaultValue="Your daily lens on the Share Market." />
            </div>
             <Button disabled>Save Changes</Button> {/* Disabled */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
            <CardDescription>Customize the appearance of the site (placeholders).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Theme customization options would go here.</p>
            <Button variant="outline" disabled>Reset to Defaults</Button> {/* Disabled */}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage API keys for integrations (placeholders).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="newsApiKey">News API Key</Label>
              <Input id="newsApiKey" type="password" placeholder="Enter your News API key" />
            </div>
            <Button disabled>Save API Keys</Button> {/* Disabled */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
