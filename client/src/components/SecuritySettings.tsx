import { Shield, Key, Smartphone, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AccountSection } from "./AccountSection";

export function SecuritySettings() {
  return (
    <AccountSection 
      title="Security & Privacy" 
      icon={<Shield className="h-5 w-5 text-primary" />}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-muted-foreground" />
              <div>
                <h4 className="font-medium">Password</h4>
                <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Change</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-muted-foreground" />
              <div>
                <h4 className="font-medium">Login Activity</h4>
                <p className="text-sm text-muted-foreground">Monitor your account access</p>
              </div>
            </div>
            <Button variant="outline" size="sm">View</Button>
          </div>
        </div>
        
        <div className="pt-4 border-t border-border">
          <Button variant="destructive" size="sm">
            Delete Account
          </Button>
        </div>
      </div>
    </AccountSection>
  );
}