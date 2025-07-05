import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  CreditCard,
  TrendingUp,
  Users,
  Calculator,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/apiService";

interface LoanScheme {
  _id: string;
  title: string;
  description: string;
  bankName: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  tenureOptions: Array<{
    months: number;
    label: string;
  }>;
  eligibilityCriteria: Array<{
    criterion: string;
    description: string;
    required: boolean;
  }>;
  requiredDocuments: Array<{
    document: string;
    description: string;
    mandatory: boolean;
  }>;
  features: string[];
  processingFee: number;
  processingTime: {
    value: number;
    unit: string;
  };
  status: 'active' | 'inactive' | 'archived' | 'draft';
  visibility: 'public' | 'featured' | 'hidden';
  targetAudience: string[];
  applicationCount: number;
  approvalRate: number;
  createdAt: string;
  updatedAt: string;
}

interface LoanFormData {
  title: string;
  description: string;
  bankName: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  processingFee: number;
  processingTime: {
    value: number;
    unit: string;
  };
  status: string;
  visibility: string;
  features: string[];
  targetAudience: string[];
}

export const LoanManagement = () => {
  const { toast } = useToast();
  const [schemes, setSchemes] = useState<LoanScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingScheme, setEditingScheme] = useState<LoanScheme | null>(null);
  const [formData, setFormData] = useState<LoanFormData>({
    title: "",
    description: "",
    bankName: "",
    interestRate: 0,
    minAmount: 0,
    maxAmount: 0,
    processingFee: 0,
    processingTime: { value: 7, unit: "days" },
    status: "draft",
    visibility: "public",
    features: [],
    targetAudience: []
  });

  useEffect(() => {
    fetchSchemes();
  }, [currentPage, statusFilter, searchTerm]);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        status: statusFilter,
        ...(searchTerm && { search: searchTerm })
      });

      const response = await apiService.get(`/executive/loan-schemes?${params}`);
      if (response.success) {
        setSchemes(response.data.schemes);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to fetch loan schemes:', error);
      toast({
        title: "Error",
        description: "Failed to load loan schemes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateScheme = async () => {
    try {
      const response = await apiService.post('/executive/loan-schemes', formData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Loan scheme created successfully"
        });
        setShowCreateDialog(false);
        resetForm();
        fetchSchemes();
      }
    } catch (error) {
      console.error('Failed to create loan scheme:', error);
      toast({
        title: "Error",
        description: "Failed to create loan scheme",
        variant: "destructive"
      });
    }
  };

  const handleUpdateScheme = async () => {
    if (!editingScheme) return;

    try {
      const response = await apiService.put(`/executive/loan-schemes/${editingScheme._id}`, formData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Loan scheme updated successfully"
        });
        setEditingScheme(null);
        resetForm();
        fetchSchemes();
      }
    } catch (error) {
      console.error('Failed to update loan scheme:', error);
      toast({
        title: "Error",
        description: "Failed to update loan scheme",
        variant: "destructive"
      });
    }
  };

  const handleDeleteScheme = async (schemeId: string) => {
    if (!confirm("Are you sure you want to delete this loan scheme?")) return;

    try {
      const response = await apiService.delete(`/executive/loan-schemes/${schemeId}`);
      if (response.success) {
        toast({
          title: "Success",
          description: "Loan scheme deleted successfully"
        });
        fetchSchemes();
      }
    } catch (error) {
      console.error('Failed to delete loan scheme:', error);
      toast({
        title: "Error",
        description: "Failed to delete loan scheme",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      bankName: "",
      interestRate: 0,
      minAmount: 0,
      maxAmount: 0,
      processingFee: 0,
      processingTime: { value: 7, unit: "days" },
      status: "draft",
      visibility: "public",
      features: [],
      targetAudience: []
    });
  };

  const startEdit = (scheme: LoanScheme) => {
    setEditingScheme(scheme);
    setFormData({
      title: scheme.title,
      description: scheme.description,
      bankName: scheme.bankName,
      interestRate: scheme.interestRate,
      minAmount: scheme.minAmount,
      maxAmount: scheme.maxAmount,
      processingFee: scheme.processingFee,
      processingTime: scheme.processingTime,
      status: scheme.status,
      visibility: scheme.visibility,
      features: scheme.features,
      targetAudience: scheme.targetAudience
    });
  };

  const calculateEMI = (principal: number, rate: number, tenure: number) => {
    const monthlyRate = rate / (12 * 100);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'archived': return 'outline';
      case 'draft': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loan Scheme Management</h1>
          <p className="text-gray-600">Manage agricultural loan offerings and applications</p>
        </div>
        <Dialog open={showCreateDialog || !!editingScheme} onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setEditingScheme(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Loan Scheme
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingScheme ? 'Edit Loan Scheme' : 'Create New Loan Scheme'}
              </DialogTitle>
              <DialogDescription>
                {editingScheme ? 'Update the loan scheme details' : 'Add a new agricultural loan scheme'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Scheme Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Kisan Credit Card"
                  />
                </div>
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                    placeholder="e.g., State Bank of India"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed description of the loan scheme..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({...formData, interestRate: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="minAmount">Min Amount (₹)</Label>
                  <Input
                    id="minAmount"
                    type="number"
                    value={formData.minAmount}
                    onChange={(e) => setFormData({...formData, minAmount: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="maxAmount">Max Amount (₹)</Label>
                  <Input
                    id="maxAmount"
                    type="number"
                    value={formData.maxAmount}
                    onChange={(e) => setFormData({...formData, maxAmount: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select value={formData.visibility} onValueChange={(value) => setFormData({...formData, visibility: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="hidden">Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={editingScheme ? handleUpdateScheme : handleCreateScheme}
                  className="flex-1"
                >
                  {editingScheme ? 'Update Scheme' : 'Create Scheme'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateDialog(false);
                    setEditingScheme(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schemes</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schemes.length}</div>
            <p className="text-xs text-muted-foreground">
              {schemes.filter(s => s.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schemes.reduce((sum, scheme) => sum + scheme.applicationCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total applications received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Interest Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schemes.length > 0 
                ? (schemes.reduce((sum, scheme) => sum + scheme.interestRate, 0) / schemes.length).toFixed(1)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all schemes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <Calculator className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schemes.length > 0 
                ? (schemes.reduce((sum, scheme) => sum + scheme.approvalRate, 0) / schemes.length).toFixed(1)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average approval rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search loan schemes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Schemes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Schemes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scheme Details</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Amount Range</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schemes.map((scheme) => (
                  <TableRow key={scheme._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{scheme.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-[200px]">
                          {scheme.description}
                        </div>
                        {scheme.visibility === 'featured' && (
                          <Badge variant="outline" className="mt-1">Featured</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{scheme.bankName}</TableCell>
                    <TableCell>
                      <span className="font-medium">{scheme.interestRate}%</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>₹{(scheme.minAmount / 100000).toFixed(1)}L - ₹{(scheme.maxAmount / 100000).toFixed(1)}L</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{scheme.applicationCount}</div>
                        <div className="text-xs text-gray-500">{scheme.approvalRate}% approved</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(scheme.status) as any}>
                        {scheme.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => startEdit(scheme)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDeleteScheme(scheme._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
