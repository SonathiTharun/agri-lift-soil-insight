import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Package,
  Sprout,
  Bug,
  Wrench,
  Droplets,
  Tractor,
  Leaf,
  Heart,
  CreditCard,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickAddModalProps {
  open: boolean;
  onClose: () => void;
}

const QuickAddModal: React.FC<QuickAddModalProps> = ({ open, onClose }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', role: 'farmer', phone: '', email: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(res => setTimeout(res, 1200));
      toast({ title: 'User Added', description: `${form.role === 'farmer' ? 'Farmer' : 'Executive'} ${form.name} added successfully.` });
      onClose();
    } catch {
      toast({ title: 'Error', description: 'Failed to add user.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const productActions = [
    {
      title: "Add Fertilizers",
      description: "NPK, Organic, Liquid fertilizers",
      icon: Sprout,
      color: "bg-green-500",
      action: () => {
        navigate("/executive-portal/products?category=fertilizers&action=add");
        onClose();
      }
    },
    {
      title: "Add Pesticides",
      description: "Insecticides, Herbicides, Fungicides",
      icon: Bug,
      color: "bg-red-500",
      action: () => {
        navigate("/executive-portal/products?category=pesticides&action=add");
        onClose();
      }
    },
    {
      title: "Add Seeds",
      description: "Crop seeds, Saplings, Varieties",
      icon: Package,
      color: "bg-yellow-500",
      action: () => {
        navigate("/executive-portal/products?category=seeds&action=add");
        onClose();
      }
    },
    {
      title: "Add Farm Tools",
      description: "Hand tools, Equipment, Implements",
      icon: Wrench,
      color: "bg-blue-500",
      action: () => {
        navigate("/executive-portal/products?category=tools&action=add");
        onClose();
      }
    },
    {
      title: "Add Irrigation",
      description: "Drip systems, Sprinklers, Pipes",
      icon: Droplets,
      color: "bg-cyan-500",
      action: () => {
        navigate("/executive-portal/products?category=irrigation&action=add");
        onClose();
      }
    },
    {
      title: "Add Machinery",
      description: "Tractors, Harvesters, Tillers",
      icon: Tractor,
      color: "bg-purple-500",
      action: () => {
        navigate("/executive-portal/products?category=machinery&action=add");
        onClose();
      }
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quick Add - Products & Users</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Add Products</TabsTrigger>
            <TabsTrigger value="users">Add Users</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Add Agricultural Products</h3>
              <p className="text-gray-600">Choose a product category to add</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Products
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                      <Button
                        className="w-full group-hover:bg-primary/90 transition-colors"
                        onClick={action.action}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Now
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Need More Options?</h4>
              </div>
              <p className="text-blue-700 text-sm mb-3">
                For advanced product management with detailed forms, visit the Executive Portal.
              </p>
              <Button
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
                onClick={() => {
                  navigate("/executive-portal/products");
                  onClose();
                }}
              >
                Go to Executive Portal
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Add New User</h3>
              <p className="text-gray-600">Register a new farmer or executive</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
              <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded p-2">
                <option value="farmer">Farmer</option>
                <option value="executive">Executive</option>
              </select>
              <Input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
              <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} required type="email" />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add User'}</Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default QuickAddModal; 