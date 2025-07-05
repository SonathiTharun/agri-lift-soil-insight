import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Bell,
  Settings,
  BarChart3,
  DollarSign,
  Package,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface AdminStats {
  totalFarmers: number;
  totalBuyers: number;
  pendingVerifications: number;
  totalTransactions: number;
  monthlyRevenue: number;
  activeListings: number;
}

interface PendingVerification {
  id: string;
  type: 'farmer' | 'buyer';
  name: string;
  email: string;
  phone: string;
  location: string;
  submittedAt: string;
  documents: string[];
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Mock data - replace with real API calls
  const [stats, setStats] = useState<AdminStats>({
    totalFarmers: 1247,
    totalBuyers: 89,
    pendingVerifications: 23,
    totalTransactions: 5678,
    monthlyRevenue: 2450000,
    activeListings: 456
  });

  const [pendingVerifications, setPendingVerifications] = useState<PendingVerification[]>([
    {
      id: '1',
      type: 'farmer',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '+91 9876543210',
      location: 'Warangal, Telangana',
      submittedAt: '2023-12-01T10:30:00Z',
      documents: ['aadhar.pdf', 'land_records.pdf'],
      status: 'pending'
    },
    {
      id: '2',
      type: 'buyer',
      name: 'Fresh Dairy Ltd.',
      email: 'contact@freshdairy.com',
      phone: '+91 9876543211',
      location: 'Hyderabad, Telangana',
      submittedAt: '2023-12-02T14:15:00Z',
      documents: ['fssai_license.pdf', 'gst_certificate.pdf', 'company_registration.pdf'],
      status: 'reviewing'
    }
  ]);

  const [selectedVerification, setSelectedVerification] = useState<PendingVerification | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Check if user is admin
  const isAdmin = user?.role === 'executive' || user?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleVerificationAction = async (id: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      setLoading(true);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPendingVerifications(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, status: action === 'approve' ? 'approved' : 'rejected' }
            : item
        )
      );

      toast({
        title: action === 'approve' ? 'Verification Approved' : 'Verification Rejected',
        description: `${selectedVerification?.name} has been ${action}d successfully.`,
      });

      setShowVerificationModal(false);
      setSelectedVerification(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process verification. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredVerifications = pendingVerifications.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterStatus || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage dairy marketplace operations</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="verifications">
              Verifications
              {stats.pendingVerifications > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {stats.pendingVerifications}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Farmers</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalFarmers.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Buyers</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalBuyers}</p>
                    </div>
                    <Building className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
                      <p className="text-2xl font-bold text-red-600">{stats.pendingVerifications}</p>
                    </div>
                    <Clock className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">₹{(stats.monthlyRevenue / 100000).toFixed(1)}L</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Listings</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeListings}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium">New buyer verified</p>
                      <p className="text-sm text-gray-600">Heritage Foods completed verification process</p>
                    </div>
                    <span className="text-sm text-gray-500">2 hours ago</span>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium">High-value transaction</p>
                      <p className="text-sm text-gray-600">₹2.5L transaction between farmer and processor</p>
                    </div>
                    <span className="text-sm text-gray-500">4 hours ago</span>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="font-medium">Quality alert</p>
                      <p className="text-sm text-gray-600">Milk quality below standards reported in Warangal region</p>
                    </div>
                    <span className="text-sm text-gray-500">6 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verifications Tab */}
          <TabsContent value="verifications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Pending Verifications</CardTitle>
                  <div className="flex gap-4">
                    <Input
                      placeholder="Search verifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredVerifications.map((verification) => (
                    <div key={verification.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {verification.type === 'farmer' ? (
                            <Users className="h-8 w-8 text-blue-600" />
                          ) : (
                            <Building className="h-8 w-8 text-green-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{verification.name}</h3>
                          <p className="text-sm text-gray-600">{verification.email}</p>
                          <p className="text-sm text-gray-500">{verification.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Badge 
                          variant={
                            verification.status === 'approved' ? 'default' :
                            verification.status === 'rejected' ? 'destructive' :
                            verification.status === 'reviewing' ? 'secondary' : 'outline'
                          }
                        >
                          {verification.status}
                        </Badge>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedVerification(verification);
                            setShowVerificationModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-500">User management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-500">Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Verification Modal */}
      <Dialog open={showVerificationModal} onOpenChange={setShowVerificationModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Verification - {selectedVerification?.name}</DialogTitle>
          </DialogHeader>
          {selectedVerification && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Type</label>
                  <p className="capitalize">{selectedVerification.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <Badge className="ml-2">{selectedVerification.status}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p>{selectedVerification.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p>{selectedVerification.phone}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <p>{selectedVerification.location}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Documents</label>
                <div className="mt-2 space-y-2">
                  {selectedVerification.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{doc}</span>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowVerificationModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleVerificationAction(selectedVerification.id, 'reject')}
                  disabled={loading}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleVerificationAction(selectedVerification.id, 'approve')}
                  disabled={loading}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
