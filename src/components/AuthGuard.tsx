import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  fallback?: React.ReactNode;
  message?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  fallback,
  message = "Please log in to access this feature."
}) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (!requireAuth || isAuthenticated) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Shield className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle>Authentication Required</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-600">{message}</p>
        <div className="flex gap-2 justify-center">
          <Button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            Log In
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/register')}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Sign Up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface ProtectedActionProps {
  children: React.ReactNode;
  onUnauthorized?: () => void;
  className?: string;
}

export const ProtectedAction: React.FC<ProtectedActionProps> = ({
  children,
  onUnauthorized,
  className = ""
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      e.stopPropagation();
      
      if (onUnauthorized) {
        onUnauthorized();
      } else {
        navigate('/login');
      }
    }
  };

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  );
};
