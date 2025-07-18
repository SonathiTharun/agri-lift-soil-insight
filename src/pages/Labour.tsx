import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MapPin, Clock, Star, Phone, Mail, Calendar, Filter, Search, 
  ChevronDown, ChevronUp, Heart, Share2, MessageCircle, CheckCircle, 
  AlertCircle, TrendingUp, Award, Shield, Zap, Eye, UserPlus, 
  Briefcase, BarChart3, Settings, Bell, Download, Upload, 
  Target, Sparkles, Activity, Globe, Headphones, Video,
  FileText, DollarSign, Timer, ThumbsUp, Send, Plus,
  ArrowRight, ArrowLeft, RefreshCw, SlidersHorizontal,
  UserCheck, Building, Truck, Wrench, Leaf, Droplets,
  Sun, Moon, Wind, CloudRain, Thermometer, Gauge
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/components/LanguageContext';
import { Layout } from '@/components/Layout';

// Types for better type safety
type WorkerCategory = 'all' | 'planting' | 'harvesting' | 'irrigation' | 'machinery' | 'livestock' | 'pest-control' | 'soil-management' | 'greenhouse';

type JobType = 'full-time' | 'part-time' | 'contract' | 'seasonal' | 'temporary' | 'freelance';

type Worker = {
  id: string;
  name: string;
  category: WorkerCategory;
  skills: string[];
  experience: string;
  location: string;
  rating: number;
  reviews: number;
  hourlyRate: string;
  dailyRate: string;
  availability: string;
  phone: string;
  email: string;
  image: string;
  verified: boolean;
  premium: boolean;
  completedJobs: number;
  responseTime: string;
  languages: string[];
  successRate: number;
  lastActive: string;
  badges: string[];
  specializations: string[];
  teamSize?: number;
  isTeam?: boolean;
  teamLeader?: string;
  description: string;
  certifications: string[];
  equipment: string[];
  workingHours: string;
  emergencyAvailable: boolean;
};

type Job = {
  id: string;
  title: string;
  type: JobType;
  description: string;
  requirements: string[];
  location: string;
  payRate: string;
  deadline: string;
  postedBy: string;
  postedDate: string;
  applications: number;
  status: 'active' | 'closed' | 'draft' | 'expired';
  priority: 'urgent' | 'high' | 'standard' | 'low';
  category: WorkerCategory;
  duration: string;
  benefits: string[];
};

const Labour = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('find-workers');
  const [selectedCategory, setSelectedCategory] = useState<WorkerCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteWorkers, setFavoriteWorkers] = useState<string[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterExperience, setFilterExperience] = useState('');
  const [filterRate, setFilterRate] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    activeWorkers: 1247,
    availableNow: 89,
    jobsPosted: 156,
    successfulHires: 2341
  });

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeWorkers: prev.activeWorkers + Math.floor(Math.random() * 3) - 1,
        availableNow: prev.availableNow + Math.floor(Math.random() * 5) - 2,
        jobsPosted: prev.jobsPosted + Math.floor(Math.random() * 2),
        successfulHires: prev.successfulHires + Math.floor(Math.random() * 2)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const workerCategories = [
    { id: 'all' as WorkerCategory, nameKey: 'all-workers', count: 156, icon: Users },
    { id: 'planting' as WorkerCategory, nameKey: 'planting-specialist', count: 45, icon: Leaf },
    { id: 'harvesting' as WorkerCategory, nameKey: 'harvest-expert', count: 38, icon: Sun },
    { id: 'irrigation' as WorkerCategory, nameKey: 'irrigation-specialist', count: 28, icon: Droplets },
    { id: 'machinery' as WorkerCategory, nameKey: 'machinery-expert', count: 25, icon: Wrench },
    { id: 'livestock' as WorkerCategory, nameKey: 'livestock-expert', count: 20, icon: Building },
    { id: 'pest-control' as WorkerCategory, nameKey: 'pest-control-expert', count: 18, icon: Shield },
    { id: 'soil-management' as WorkerCategory, nameKey: 'soil-management', count: 15, icon: Gauge },
    { id: 'greenhouse' as WorkerCategory, nameKey: 'greenhouse-specialist', count: 12, icon: Wind }
  ];

  const workers: Worker[] = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      category: 'planting',
      skills: ['Seed Planting', 'Soil Preparation', 'Organic Farming'],
      experience: '8 years',
      location: 'Punjab, India',
      rating: 4.8,
      reviews: 124,
      hourlyRate: '₹150',
      dailyRate: '₹1200',
      availability: 'Available',
      phone: '+91 98765 43210',
      email: 'rajesh.kumar@email.com',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-F29HfrvQQgJnUVO5TCmZ3vT7hUw1mCSuOQ&s',
      verified: true,
      premium: true,
      completedJobs: 89,
      responseTime: '< 2 hours',
      languages: ['Hindi', 'Punjabi', 'English'],
      successRate: 96,
      lastActive: '2 hours ago',
      badges: ['top-rated', 'quick-responder', 'eco-friendly'],
      specializations: ['Organic Farming', 'Precision Agriculture'],
      description: 'Experienced agricultural worker specializing in organic farming and sustainable practices.',
      certifications: ['Organic Farming Certificate', 'Soil Management'],
      equipment: ['Hand Tools', 'Spraying Equipment'],
      workingHours: '6 AM - 6 PM',
      emergencyAvailable: true
    },
    {
      id: '2',
      name: 'Priya Sharma',
      category: 'harvesting',
      skills: ['Crop Harvesting', 'Post-Harvest Processing', 'Quality Control'],
      experience: '6 years',
      location: 'Haryana, India',
      rating: 4.9,
      reviews: 98,
      hourlyRate: '₹180',
      dailyRate: '₹1440',
      availability: 'Available',
      phone: '+91 98765 43211',
      email: 'priya.sharma@email.com',
      image: 'data:image/jpeg;base64,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',
      verified: true,
      premium: false,
      completedJobs: 67,
      responseTime: '< 1 hour',
      languages: ['Hindi', 'English'],
      successRate: 98,
      lastActive: '1 hour ago',
      badges: ['premium-worker', 'quick-responder'],
      specializations: ['Harvest Management', 'Quality Assurance'],
      description: 'Expert in crop harvesting with focus on quality and efficiency.',
      certifications: ['Harvest Management', 'Food Safety'],
      equipment: ['Harvesting Tools', 'Quality Testing Kit'],
      workingHours: '5 AM - 7 PM',
      emergencyAvailable: false
    },
    {
      id: '3',
      name: 'Suresh Patel',
      category: 'irrigation',
      skills: ['Drip Irrigation', 'Sprinkler Systems', 'Water Management'],
      experience: '12 years',
      location: 'Gujarat, India',
      rating: 4.7,
      reviews: 156,
      hourlyRate: '₹200',
      dailyRate: '₹1600',
      availability: 'Busy until Dec 15',
      phone: '+91 98765 43212',
      email: 'suresh.patel@email.com',
      image: 'data:image/jpeg;base64,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',
      verified: true,
      premium: true,
      completedJobs: 134,
      responseTime: '< 3 hours',
      languages: ['Gujarati', 'Hindi', 'English'],
      successRate: 94,
      lastActive: '3 hours ago',
      badges: ['irrigation-specialist', 'water-expert'],
      specializations: ['Smart Irrigation', 'Water Conservation'],
      description: 'Irrigation specialist with expertise in modern water management systems.',
      certifications: ['Irrigation Technology', 'Water Management'],
      equipment: ['Irrigation Tools', 'Water Testing Kit'],
      workingHours: '7 AM - 5 PM',
      emergencyAvailable: true
    },
    {
      id: '4',
      name: 'Anita Singh',
      category: 'machinery',
      skills: ['Tractor Operation', 'Harvester Operation', 'Equipment Maintenance'],
      experience: '5 years',
      location: 'Uttar Pradesh, India',
      rating: 4.6,
      reviews: 78,
      hourlyRate: '₹250',
      dailyRate: '₹2000',
      availability: 'Available',
      phone: '+91 98765 43213',
      email: 'anita.singh@email.com',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      verified: true,
      premium: false,
      completedJobs: 45,
      responseTime: '< 4 hours',
      languages: ['Hindi', 'English'],
      successRate: 92,
      lastActive: '4 hours ago',
      badges: ['machinery-expert', 'reliable'],
      specializations: ['Heavy Machinery', 'Equipment Repair'],
      description: 'Skilled machinery operator with expertise in modern agricultural equipment.',
      certifications: ['Machinery Operation License', 'Safety Training'],
      equipment: ['Tractor', 'Harvester', 'Maintenance Tools'],
      workingHours: '7 AM - 6 PM',
      emergencyAvailable: true
    },
    {
      id: '5',
      name: 'Vikram Reddy',
      category: 'livestock',
      skills: ['Cattle Care', 'Dairy Management', 'Veterinary Assistance'],
      experience: '10 years',
      location: 'Telangana, India',
      rating: 4.8,
      reviews: 112,
      hourlyRate: '₹175',
      dailyRate: '₹1400',
      availability: 'Available',
      phone: '+91 98765 43214',
      email: 'vikram.reddy@email.com',
      image: 'data:image/jpeg;base64,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',
      verified: true,
      premium: true,
      completedJobs: 78,
      responseTime: '< 2 hours',
      languages: ['Telugu', 'Hindi', 'English'],
      successRate: 97,
      lastActive: '1 hour ago',
      badges: ['livestock-expert', 'veterinary-trained'],
      specializations: ['Dairy Farming', 'Animal Health'],
      description: 'Experienced livestock specialist with veterinary training.',
      certifications: ['Veterinary Assistant', 'Dairy Management'],
      equipment: ['Medical Kit', 'Milking Equipment'],
      workingHours: '5 AM - 8 PM',
      emergencyAvailable: true
    },
    {
      id: '6',
      name: 'Meera Joshi',
      category: 'greenhouse',
      skills: ['Greenhouse Management', 'Hydroponic Systems', 'Climate Control'],
      experience: '7 years',
      location: 'Maharashtra, India',
      rating: 4.9,
      reviews: 89,
      hourlyRate: '₹190',
      dailyRate: '₹1520',
      availability: 'Available',
      phone: '+91 98765 43215',
      email: 'meera.joshi@email.com',
      image: 'data:image/jpeg;base64,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',
      verified: true,
      premium: false,
      completedJobs: 56,
      responseTime: '< 1 hour',
      languages: ['Marathi', 'Hindi', 'English'],
      successRate: 99,
      lastActive: '30 minutes ago',
      badges: ['greenhouse-specialist', 'tech-savvy'],
      specializations: ['Controlled Environment', 'Precision Farming'],
      description: 'Greenhouse specialist with expertise in modern controlled environment agriculture.',
      certifications: ['Greenhouse Technology', 'Hydroponic Systems'],
      equipment: ['Climate Sensors', 'Hydroponic Setup'],
      workingHours: '6 AM - 7 PM',
      emergencyAvailable: false
    },
    {
      id: '7',
      name: 'Ramesh Yadav',
      category: 'pest-control',
      skills: ['Integrated Pest Management', 'Organic Pesticides', 'Crop Protection'],
      experience: '9 years',
      location: 'Rajasthan, India',
      rating: 4.7,
      reviews: 143,
      hourlyRate: '₹160',
      dailyRate: '₹1280',
      availability: 'Available',
      phone: '+91 98765 43216',
      email: 'ramesh.yadav@email.com',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      verified: true,
      premium: true,
      completedJobs: 98,
      responseTime: '< 3 hours',
      languages: ['Hindi', 'Rajasthani', 'English'],
      successRate: 95,
      lastActive: '2 hours ago',
      badges: ['pest-control-expert', 'organic-certified'],
      specializations: ['IPM', 'Biological Control'],
      description: 'Pest control specialist focusing on sustainable and organic methods.',
      certifications: ['IPM Certification', 'Pesticide License'],
      equipment: ['Spraying Equipment', 'Detection Tools'],
      workingHours: '6 AM - 6 PM',
      emergencyAvailable: true
    },
    {
      id: '8',
      name: 'Kavitha Nair',
      category: 'soil-management',
      skills: ['Soil Testing', 'Nutrient Management', 'Soil Conservation'],
      experience: '6 years',
      location: 'Kerala, India',
      rating: 4.8,
      reviews: 76,
      hourlyRate: '₹170',
      dailyRate: '₹1360',
      availability: 'Available',
      phone: '+91 98765 43217',
      email: 'kavitha.nair@email.com',
      image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMVFRUXGBgaGBgYGBoXGhodGhgdGh0fFxgdHSggGBolHRoXITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy8lICYuLTAtKy0tLy8tLS0tLy0tLS0vLy0tLS0tLTUtLS0tLS0tLS0tLS0tLS0tLS0tLS0rLf/AABEIAKMBNgMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAEBQIDBgABB//EAEEQAAIBAgUCBAQDBwMCBAcAAAECEQADBAUSITFBURMiYXEGMoGRQqGxFCNSYsHR8HKC4QckFZKi8TNTY6OywuL/xAAbAQACAwEBAQAAAAAAAAAAAAACAwEEBQAGB//EADURAAICAQMCAwYEBQUBAAAAAAABAhEDEiExBEETUWEFIjJxsfCBocHRFDOR4fEVI0JScgb/2gAMAwEAAhEDEQA/AM+9sqqgGSFoi7fVUUTPtVOHg6Y4INQtIJ2MkdDVNvbcmbJXEYjUu47GnGT/APwjtEmka4tZIIineDvfugfWui96BhyA4i7LERt3ry0JIWJkxNBXmBc7ld6Z5Ivnk8CuoFK2M8edCkL+EVnJJ32NMszvNrIAkdaAIB6EGismbtkDbn0rgpHeoFekkV6moDc0VglnvTvCXAuFJnkn9aQm41Mw/wD2/H+b1DDh3FmgTsSK4q38VSFyPwip+J6VIJfgEYssxyP1plmuF1XJ2gAUBhbkMDttvVuLxpZiRsKBt9gk1QZhVRTsBNF3CwIIalmEUsR5hTnwyI3mkTW9hx4K3ubTwa5WY7Amm+fLhsKllWU3L7mFRWL6uCXYBQwVR0G3mjnzCFjMSzgIttVBYSttIAHQnXIuwyjT1J+w5FpQxcWwJFaRPM81K5Yi8Q2+wq45w9olrlu1EBQGkkludLQTMiYO0H3NDY7EbC4JGqR6bdtzIIIIPrXY6+HuS/JlV1SWLRsNhVToT+EGhL+YiAFJqoY2F3Uk0aUnuIkw5cORMKBNcikdqC/bHIkJB969w73SJIA+tRTAGWExGnVMbjpU8LaGlvWlTXXncgCmOXv5CSZ3oknaDjyL8xsMYjgUve2xMRTQ3m3g7VK1c71KyNci3yLMXdiEjYV10/KtG3rSkzXmHwwNxSYiaZHIjr3JZ3iPKiDoKoym6QzHsK7PLM3CRuKpwdohX54pqqgr94nh8TJM9aJtX44FKLQ35o/LusmKGeyshPYeviCFUD3NMcmx/wC87bGswmYKWjc00yi8NbMOAtLu2FGVsJxYDEk7kkmvKEW9AnuTXVOlj1IzNvD+HaTvE0mV3LcGe9Ns6v6EH+kUpTHtzFTvQqZcVM9CaKw+MdBHK0OceG+Zast3F4mPShbYAxt3EuCNpqS2fDPlNLv2bfUp+1EeI46z6UtejA4J+M8zsasBLA7Qa8CoRvKtXltWXrNTdkA4fuCD3r1tUd6JGI6MtSS2DwdqLVRNi43H/hpxdJ/Z1kf5FD3MORuGo7MmIsoJEx/QUakmHHhiTxB1UipJeWeYqQdusGplF5IqbIJLikB33qLYhPXerbBSfl/KjbYQ/h/KltpdiQOxjlBgSa0GRDxbigzoHmf/AEjp9SQv+6lwVV3C1pcjQJhr10iCy3I/0oh3/wDOf/SKFVJ8BwRTY038TdxJYhbSpbDAqGJM3GVSRt5iOP4ekbrsZmLXHGhkLcrpEMEXynU7MZcAbQRMGADFIcDcxTW2XQl7Vd8VNZbSCEUFmQAC4F02wJgEnqOfcVm2O06J0krplVExO+kaio/8u2++9Ljg1Xe/4/fcdKLXKHmGxzO9suW+Zl3KAbAhiJbcDUfLERv1oxrqmy9s3NbIdQkaSRtJ0TKwDuD3BnesSMuxTNLeKJmG1knfuG23kzt1PenGXYt/HS1fbzhXQEqF1BxHTYmfT67RTo4Xdt2waa3kWl52GketV3Ad4cVTev8AQKZ9qtZFgSCTQ1Qlni2GjzXDFSEdJPuagJPKkDpU9JrrBLQpPYUwwqxa95oIlQN2AimmEvA2ZH+c10bsOHIia5tsDXtpyATVN/FgGBVb4iRE11AurLXeTNei9tJqgMAOT9q9LdyamgGErcmvNLCdJ+lCh+xNSk9zXEHftQnSUiaNw1lZ58scVVasao1GrhoXZRPrNQ5eRJVbwJY7DSBTjL00K0jkUvtYhgIPJO1V2xeJY7kChTZKu7QyN0QAdor2l109Z3rqi2TT8xPm18FoIBApdbdSONpqrEYjzaj0oixiFYDYU6SYUuT274XaaHOHVt1Me9FvgkPBg+lRXARvPNCmgbB7aXQZHFE3mYkavK1WW8GeA1WCw0+cyKhyObJIW5IBiuu3QVjdTNdbwzD5Gn3ogao3WTQ33QBRpuAbEMKsTMQNisGrLVyCfKR6VZdw63BxBrta7klAzFaaY++mlSeIrO3cBBijsfaNy2AORTUo9glVMtm3ypqHl/jFD5XlhJh9qarktsb8mlucY7WQDxts4FXJcWB55NXf+Fp/DUTlNs7wRQ+JFkpnTuNxNarOP3WFvKPwYdln/UDv9WUn60kyHJEOIRpJCHWR/p4/9WmjPjC8Vwl5gJZ3tIATyAwJ59GemQp8FnAldsyOAv6r2lGIAi0oGwIHPm9WL8CY/PZYTCeEgeAWbr0+nYVgv+nmAe9iEQSGgszHlRG5456T61rfi3PnN4YdGuW0UhFFtYkfxO54WZ4mplGqii3CeqTmxhcdzvtQGZ4XxUhlBI3RuoPIilWTm413wyXujctr3Ag7b9ftQ9zMr3jsA7KFBYiNtu8+3/FArvkfJpx3RLCuzgNqAkcVY5admoG7jAh0wBBPHqZH61BM1boBR6WzGlHca2sO87sTRb4fSJj7mkdvN3+WN/Sm1hpUF/rJoJJrkiimzbG5YCmJuabagQJ3pdeKmIG01bmV/SQNMwKlWStkA3QTMAVK1h3ifKBVQzFSY0x3qu/iVIgEAVO4BYXaYMVa9v8AmoW1i1XaJ9avv5nbA8ompaZ1FhaPxQKkt1BsTVCZkkSV39astoHbVsKivMg9e8gM+Y1VcGr5SQaO8EsdiNqhiEEgTQqSRIMqN+KabZbcXzLJ+WgBYE//ABJPao4a4qGZk0V9wk63KWvNJieTXURfxBPBArq7cChDdwKMdmPtVIygAiWigMPjHG46VeMafxCjcZeYdMZDCFTCtJqy7hbhiGE9qTJjIaZo+zitZAEySAPrQuMkTTGDZY6BXuvoDbiBO3rVWLUqiuH8RWJBgbiOJpl8S3NULbM6BB9KS5BfLu9o8xIHciuim1bNPPh6eOJKPxdzxMxgQAautY4svzQa79tSYKgH2rxSCJAA3rnXkZVHt3NSDBO9T/8AGj+GrdSjkKammDtsZCiDzQe7fBGxXh85DHzL9aIfHAfLSfMr7K8osBTt14p9YtpetpfkDVs0dGFMljjGNoLTXJ7hsX1NHpi0O5YbV5g0tAbnaaILWDsApNUpyV8AbHtu8nOoRV/jJEyBVFywB+DntXJgl0/LS20TRo8itjQ7gjeFn8z+o+1Z3/qa2nCWLZjz3dR9AQ5Wf9xH5VpsvtBbFu2ogsR923H5EVl/+qDi6Xt9Etgj21QP/wAG+9aGJVFFvGqSEXwLfexd1EeYqVY9xyPqNga02IzcXDDKscAf81krQuWUwt0jytaK6p6sgfce6tv6VdZsFgCCSTuO3P8AakOWp2macIqKquDSJmq2IbwXfU0eSANMbsSeeuwmvLbo5a5pg6uCPz+870oN9xsbjnjhAR9iZ/Or8MjXGUFtpHTTt12k9AT9Kl7oLZbsNezbYyySTvUzgrMfJVJEtAapwZgPSHJ+Zgyk3Js8OW2l8wXeo3cGjjrUrl0DaSTULeIHeKhSmRraAnyVtagPtI2qePyu41wkMIiIppYxSFuZiic4v2rNtJWXb5j2mnRyTcR+LFLInRkW+G3MyaFu5K68itXbxdsmJM1azpMc1HjzXInUYo4A8VU+XkVtZTc6RULmFQgGKJdQybRi72CYiTT/AOE8jNzVcvMy2xwAPm+vQU5sYFdoEyYAqr4pxt63GGtEKsfvdo0qB/F6mKbDNq2HYFFytq0WY/C4dFhA6GYB1agfcdKxN7GOXiDMxSrNrrKQUuE9fmJn1rW5Xg1vrbuAgExPuKbLTFaic6heyoAuXTY+fdyOO1VZfiPNLnbtTfN8u13C0g8D7UFfygwNqDxIiX5IaYOxbuMQB0mvKI+FcD4YdmB3MD2rqivIOONVuYBmLEQIqzwWJ3piNMcRUJHEzNHqEqQH+xAnbmtDkWGt2bN/E3d2QabY/mI5/MUpt2HTfkUzxeU4i7ZRAulS2ozt7bUEp1s2Wumxuc7Xbc5yj2bUXNI0S20yxpRg8QLN+1c1aiG83saNzXKLuHtqq+bbf0oDC5Vce3rIjfai1KKtss6HN0kaHPsAgulwNm8wjjegBbTaTWgwWDbFYPwwdN6zsfVelIBkzDYkk0EmubM/JFxdMlCdDROEtS4VQTPMVZZwLKJ005yfCIPJuLj9uaXvLaIfTY45MijJ0u4gzsWlkBiI2gfnVmU2AFbDyCHGpfRua0mc/B9nT52IjoOT70FZye2i62YgpupHpRrJWxqz6TXFtbLsILGKadDCIMGaYDDWyZnSe4NHXcLavaboEFx+fWgb2F0vGn7Glya1UYjVBgvFF2uz771DD3bxJGoMOlK7lkBjz7Gjfh/Fs2Jtpo2kEn0XzH8hUKBy5PomHEHUOLYcz2PyL9ev0r5/nNwXLmMf+AJb+iW2c/8AquflW/Li3hNb8MRz6D/D9K+SHHM9m74Su73izkKpY/vCDwOABtVtLYvx5RLN8Y2rCWASVWzaYjbTshTbaejTv/SvG8S2T4bEL2o+zlTlka5s62kWOohRz2GrVH1r2/ahipqu2kkqL6h7zdlFjH3ok6SOv/NUYDOWuYhBsFDXFEdSbLAk/wDmqzMR4Vp9+hpR8LHS3ikgBSxJP80p/SndPBStvsn9H+tIT1Dk1oXLr6r6K2bkTG/3r39lkyOfemGKRrbFLi7DrtI94G8Hbb023qF11Vl2gRyf71k+Krop9T7PyYIqb3j5oDXDgGprhVP4asRkLSN69v3G/AAB1/4pltq0UbJ4bCqoZtMBdyazeYY57wlkYebYnban7ZiWCoo+YGfcVThXVyiuRtzVmLqC8z0ns3pIzw3J+v4ELmXOqK2mZA3Fe27bqJ07GjGx5a6FUwoFeYjHgeQFZOwoZpXVmV1/TLBJU+d6BLnidAPrUxacjkCvbjFTo2Jj6VDEpMAMeN6TTRQDsruhHF24RotgsfoNvz/Ss1lGejEX8Sbuk+JtBG0DeKMxzqti4hcBnI5/hH/NI8nyS2uq8bsiNuxNWYRShubnRdDm0Kenn7RV8QYu2946baKAAo0joP60f8F4wLqTk7wDSy9lJL6wI1cCeB3NW5dhD4qlDDFgF7U5yi40Wc3sjNpvuPTmMPDpOo8dq7EY2CQAQvSmucYfw3UOo3WSRwKSpeEwGFU1HzPNyi4umMLWOXw1EmZ3rqAwr6nby7DrG017TNTWyDU3RRawtpoEbmh8RlAbdNop/gMytGYXYnYxV+MuosaiI/l5NDGbTFiDJcPpJa5xbEx+lRwWa3MReIUFmG4jgD+lMr+aEWLwAEEx5huferPhLBKLAKnQW8zv1M8AUGeWmOt8vZG17OVxpfNh+ItqFDXidUQQBtVdq2rKiqFA59gKpxF2ypPme4RwJ2mvFxenqA52jsKoTyZMnxGtCEIr3RXdzsYXF23HyGVf2nn6U6uWQZdXldzx0NYjPyHcAesVqsPZKWl8xYEKSK0tL8KJ572j/MbDMJaUqAbh1TVGXX1TGs7NwlEYPwyxiARS85afGIJnxDOr+XtNRDaLot+ycUZS971+n9xxiceLzKxO3b0qnPMenhlV6Kaj+wFZJGnoB2ApJ8Q2z4DP/EYFTDdmnnSjHYJ+FccsG2QCwMrPrTLEYgG5pW3uOdqy+Tp4eIT/AESadW84YvqVdpgyOlMzx9+0jzGaNSCrjAkeKAqniKc5NZtliU3hGj7Rz23pU9pL5JMIq9T39KZ/B4kXDMhYUeupv/5H3pME9aFwXvIl/wBRCzW7eHtmCyx/pDck+yhm9YpVgwmHti3aUAdWO7Me7RH26UV8W4v99cP8IRF/3OoP1/vSA4gv5gY3MfQ1bnJ8HrfZfSRcFklyEYjMxMSA3QHyz7E7TQb3A/0PmEQR7j+1U38SpEXVBB69foOtBgaGlG1LwJBDD0I6j9OnWg5NXJgxyVNfuBfFCuAoG6naR+VOvgrJrN17EsSAmq5bWSGMhlDj+EMRI4PrvIeaRcslo6fZgdwY6z2re5XhLODVnCgNotoIA1agOWJ/Q/w0Us3h42k2m7W353+ldzz/AFnRuGVJe8nx5+n35BtplvWrzs+wuMV2JgGInrvuCPSlubZd+7e2DMgPbP0kfSZH3pWuIaxdW8CfDb93cWdiJJWR6Ek+1M8XsDp4QAfQ/wDJFYU21JNff3+pc/h3bxv4X2/oYmzmp09B09avwBuEzJAqF3JNTM2owd1j13g+oo/I0uK67R+HuDO1bM3FrY8plxSxzcJLdBOExitdtKok7g/UV6LC2g2+8ketMbuUnD4k7DVp1SPWgM+TVcMwp0iY60u+yNvoesxwilN9qpehRlirqZ2nSDG1eYhrRYm2CATuaEsYhkU2rZLFjM0vvWbquAQYJ396Kl5mb7QzxzZXJGvtWLbEad5XqaXZwCNJAKjiByaov2bqhCF8PpzM1aqalBYknieldwtylYizdi99V3IJA+nWnjWRsDso4WhsVhQt+03UiT9KnmeJmW6n/ABRSd0fQfZ0lPGpL7pFWKuk8ddh7UPlZAxFsDgMPy3NVMxUSeeP70DgnAvavT84qUtmN6vJUaD/AIiz9rjudUrJA+nrWfXFljzAp3lOCDqV06vNJJ6Cm17ILTkEabejp/FTJZIwelnz/PJeIxDhcxuoulCxHJ2n84rq1yYBeRBHoI/OupX8THyE2QtZXYVY8QmOgNFnC25BMAgeWdqWNasW77JvKwRMj/3pjjnFzzEERtJ2H09ap2/OzkyrOck12CLbjXJYjv7VZ8Ntpwi23gMJDA1XZusyj5kK/I0bN6H0phlZtYnUt1Al1eQp+f2puTH4uJQvdGt0OaMVb+Qnw6IboC/IDJJ9O1AYvFarutdhJAmnGf3LWHAQDSzTMngUlwd+3ebwwCRGxAmPUxVaOOSdtGo8sK2YkxIa5fEDYDf71vMBpKB9QWNtPNIMTl62yqh1Pib6+ntRWX4O4ruA40wCY3rSyJqKUTA6qalPYZZpkywcQX0iOB1NE5Y91rSI4UKPlfr9aiAshHbUjiJbaDS3HYvQQkOwBgAcfSq8pPZp2u4PTZvDmmWY3Gvr8M8EwW6VH4oeEtpAgQRPWp28Wi22Ny3cJHSOPeqc4xQxFpHSWPyhY4Hv9K7Uo0y3l9pOa4EdsFr4OnUeYHrTazld4SzEIinVHX70VgMvDLsDbuovM7exr2xhxpuLeZiT1n5SOw60TzpKrKeecXVeQGli7edkUppEHnv+prbfC2CNm2VYiNYefRYP/wCrfes1leU+CrXLl1YPyA/M30rTYMsMM2mZKhR3m4dX1gP+XpTMd6uAMS3PnueZjqv3R/PJ9wQw/JH+1V4BibVtAYJUsxP4V6mehJ/Q0pxuLUYy8uoSX0gGfMZ23jgmRv0Y1fgG8RPD35Or1CmQD33Y7d45HLpxPWez8940lytgp8es6bKg/wD1GEz/AKR19zVRRjvrJP2/ptRDWAu3foNyf8+1W2rB9vzP3P8AagtGtGL7iVMc6W7gcTuwMjnoCR68/WtVlF9/2e2r7aRPrHCg+ywI+lLHy0NcDcjYx/MOp6duewppeubBNu59ANwPvH2pHVZvc8Jd3b+/xZVj0r8ZTlvSpfq3+X5jHJMI13WNmEyVIDKycKCDwRwfUUSgN61IAGq0x+q8DuRuN/Sg8kxBtOSN9WwBJ0ztJKzudgKHyLHFWjkWwwA7grH+e1ZuSOrdPj7+oEsOVOT5rdP+v9gHK8ZJKmCpMH/P85p5hivjEM8RBCgfp6VlcqQFhcAAQKhIXgvpgwO0ifeaf4fM38r3RqZjFsPIZF3gt2ncmRxFa0sN7ow/arh1ElOC37+o1xuPd7xZIYx1MbCkzWj4jPd2Ujn1q3OyFm43B4ZTsfaqswINkQTwCev3qs56XRg6q5J3MvtEeJbbzDcdqHvYbxLgRi3cb0LdcG0GD6VX8PerbeIubL4MkidYMEe9Fjlqvci7DcZYClLZZiZ3MzAqOZkAqtvyop3PegMMoGpmJMMdUnp/SmeU2bWKOkXZG5I4iK6KvbfcivIBz9GS5aujzKyQPc0BfYk8QB1/rW1vW7TW2woXWwSVZtgSOi1icTZD7OxQjYjiI7051SZ7n2TmjHC8cuVx6lPkM6nAgbD/ADqaHXBSGaRJiPeatwGS27sldzqgb8juavsWkteRgfHaQgB2HaR602C3oX1vVxeN332VHZS5XUiqzsSAAvpRuZYtigt+GUZtzqG+1CZX/wBu5fw3LgjbaBI3rQYDNVueYpJBOovyO0elV8+VJuSjbPIZq17AWV3brJ5HEjYgg11MnxSlyUBUQPNEA+3f3rqrPK29kLv0AMRhRduFyzAKTp8k7A9+/vR2Muagi6Dp5lvLJ6EelV4rMIW3aYkQRqZd4B6mORU7WeWFc67viKG077g9o9KYm71Ldff3sdVFOLtYgMvm54B42OxFKGyrEW8QLqseuojjf9Ke4vPSJM6gxlTExHbtS05gzITqOmY4Jk1DnkvWuKCTcUeX8rXEIDpbxC27O223OnvTDBYaxgt11kNMsBqM9jS9yLiE6+DxMbxwKnj84/7fSUZLpIjRwRx+lAnKcWm79GTPLKuSzE4mzdCBVOkEkFttzz7UXl2TGW88cEEGB7VPLLa38Lqa6iFJ8xUTxwR3rNtmdyyC5BZiRJPSOIFMnindxAfmzTo9u4dLgkJMjiCON+Kncw4W3PlJ5Ucn0Jpbl+I/aLQ8S4AbgIgbEseIqzEZSbSFRdVLoQmdR49RUY8LjFqtv3I37BtvDMSfEIKMv+6egEc0C+WXVBKeVUIOltjuelLcuzxwAH8wHBG2/cUVazbTo1F7hY+bUJI32I7+9LUZ6Uq4Zy3GbYp7WpbgHmEq46E9PevMNkzXIa2S7gjkxE7gvPShtFpna6xLhW+XfU238I4A700+Lc7sJhVS15XubQohwo51Dn0qxixRjcvy/YkzOe2XdwjMviyfNqlZHbtW1sXDbw10j5lIE9yLaJ9hBrEfDSzd8PcoSDLLG522PJ3rXYlowNx+rNcP/wBwj8uKfivuOwJ02z4rmqk3WcGDqJn2NPbGKEW8SFMsPOF78N+Yn6UFi7G5+te/DzAi5aPQyp99j+f61Zn8Js+zMmnM4f8Abj5rdfqa/DgEBuSQDP6R6VIsKU5NdIDW26br7HkfTn2PpRWs+1Vmtz1OOdxQwQ7cienahcDYvtLG2d+5WZ9pr2y5PFG2bqrudMjrUPFGfJS6vq3irQ1fdBtuy0L5GkbnY96WWke3cus1u4FAJ3VhMDoSKa283PA0n2n+tQxOauONh6bUmPSRTe5T/wBTnpa08+pkctvNbB0yDO23Tboa1GDyjEXhqKG3MAu8iV5/djrJjfYcVBfiV1/E33JofJc2ecTZB8hRryjgIyjU2nsGAO3c1etGVTaLfiWyBYKLcDXVgAadIKiBpUSYgbz/AIBctwV5rC6pIZxsoliP6ihf/EFLBn80VovhzOr7I1vD2BpXg6h13O3SkzVszupxpNMPzPKkGkEBViSSNInoPek37aiMzPGg7bHf0il+c/tKsz33cwZHmlR2BWkWLi866YUfjC78dY6UtwUp2kV0r3NNhcRbu6lQAnrJ3Y9InmrctS2uIgyoIMn5do3mOaS5dmFq0fKSGB6jkd5PFEZlh7t4eLbW4w0wzDeN9o7ClvaSSRzY+wmYh7ii0rNpJ/CRCz3NK/ieGuwbRlh+HkCeppDhfiMozDSwXcbHft9qtxOdXfDGmdJnXc6j2FHpd0u5YfUy0RinwNMrvLaUkDeNlHIjme1dlmIuG4WFpGQEtB+cbTzWfAtaCyX7gY9DMn+1G2xireH1Naui1O+2k/UneKco6Q/GlLaX5jbGkFWZEYMxkryQfftWefHXUBA2DczvP/NTu4ebWq21wOzKNJkCSeBHPIq3EhEfwrbu7IQJZfKzcEoZJgHoRvSm4X3sqz+Lc8svdKjXc09tZgR6etdS7FvcuEksSQT5T09a9roxjW9CzSXcViUa7hLYsjxRCnUsxHyhmIgwOu81V8J/CviW2/aHe0oJ+YRAG+oE7GtAlrChluFUN22dgSAxAmZAO9U51gbjLrUbQNp6FthB2IPrVfxskNMZfjs+33zYWpiK7ct2xujPbJlChJGnu6joeauXH3mtjyKbaGQtsRINQyjHNaxXh3G8NXbQVZZAPSAPcDtvW2+ILeHsJoVW1XQ3mDREdAOkz0FWMcnoba2Oi7Pl+Ce414G3bJ3Pl52PQ0+znEXGCPbtrNhvPonfaQfYbip5R8OanXw7722E611bCCZLHmfTjimOByU24i5K6yhYzBESCe2/60TnDajpcbGazew7zftEEMASq8yOSV70OMvxd5A2huBGo6Sfp1rbNjThHKlFCPMxv9VbvHShs8YalVCbmsSAGghdjMHYRxHWoWbRDU1v5Eaq4Ez5ddQK64ZlNuDAMkGNyB2Pel+DveI7NdZ9TfhP4geI7iiM4zQ7W08QXAD4lxjFwzsFMQAoHSo5PkxNwM3ySulmO8joBR0qfr97Ep2xnnOXeLZRLQ0m1yBsGnknsRTjMbqWrVi3eAv3FgEjywDEKWH0oPEPZLm2XJJca1BiImQe1SyzE2FdxZ1vZtkFmafKSCD7j37UGWTUG19/IlLzD8fjsPZ0jDoEuOwUwNRHfbsO9UpkNi34mLxF57hUyJ2k8BYHrUrr4a7ZNy1bRbgLBQPKBB+Ykbb/AK0gwgu3S3i3SltZKmZUsDpgdJ2otaS3X4eQLbvYaZPmdt2tW9VxmQtcfZQo0gsADz82kUwzO9py20Dzc/Qln/IMB9RSa1fa2124+ksURQRAG7COP5VNPMfhQ2Gwat8qWEYgczpUQP8AO9Hj33LeJPTufPc0fShMQxBA9z/YSfpWcy2/4V1WnykEH2Pt6gGjviXM9d70UkbcdoHoP70oJLGSCB0+21WVF/gNjk0NSjyjeJg2H7wsgC7wAxkRxJbrxx1qy64LbGfuP/b9asyJ9OEttcPz6122IRCV1eh2kf6R3qnFsJ8QA6SSvm2JI3MD+UFQfXboao6vfcTe8bL/AAyndaglDp4q8YdX/GUPcAEH3FLlxY68dani9QHlIg01Ge3ZPMcKbaE27qlvVY/rWYOLxRBlyNJ8y7jngz2pm2IgyTJ7UDdvFnH83l+gO/8AajTQMYynLSgrKLF67MFSQJCs4Ut/oJEE7dSOaYYTB4gG5bTD3fGuiCCjKFQEcM4AMkCW2A4EzXYLB+JbNtVUvIKzA4539p+3rWtwH7YwZXRLCqFFtg+5iJ7kjuf1qv8AxEafmu3oK67xOlyeG/JGQzzIrmGto11gLjE+SJAA3ktO/TjvSbC4x7fmDFDydJK7dtulaj4kd7mqXDeGulo84kmZ1capgfSs/icuui2LjJCs+hQfx9SV7jjfua6OTUrMuUpT3Y/zn4gsLaW4iF7jjudIMcn+Kgcvxfjav+1B1DlQVIMfhP8ASp4L4aujS7W2CSVVjuoYyB6x1mK0tgOiJhrttFLSx8NymyggB4G0k9OYrp5Ixi9uAW0jL5bk2JLB0tMDJk3I0BeJZjtFX4TPMVaFxbBAJOkAQbexgke9GXrjN+6BW4FLA23Z9BURADE+bfgEdKSnNA6eC1q2kMeDoIg8R15P2qcU1JWEpKrFoy+4NTsQ7SSwXeJPWNqru4l9BVhCz23P1pnhss8R9KX3t2+pZTAP8Mjk9u9N8pyy+puJauoChB/fQQ2oSBpggbDkmnWr2OUlwR+HsE6WdYti4T5tl1MAPT0NE38ebsMWckGSCTtG0aTtG3BFajBWbuHcM3h20ZPMqN5S0iGUkQvJ8tCNilxF+4hCuS3lIGmVEAS8+bdnj/Ip9TFtXFu/JEOzParlzEWQs+E1y036yfSQo+1F4/LrVu4FS+BpE6gCQxLEtLCdJE8kdqe5jhbGGOkXG8Qqx0yCVQD8IHBB4nsaT4/H2zcD2iAggDXsSSvmkfKeB1545mhnBwjpf+SZOPmBYr4fsoB57wJJ8oXxDAPMgfL2J3NdQ7eK5Ok21WfmBO5POrYeb27GupbUm7e39f2FOL8h3eyJFLAKwnSZPl1ayd5LTEwBA7/WD5hfw4Hg6ntkaTafz7sQDpIg7sdhvzTzB28PibjanuQiwCdIgAzPWVEggn8qWZlixaXWHUvokQmmHAbfnzjUJ3M8R2opwyR96L2CaXYV47Lr9y2A1pPFs7hvG3RWJiVGw6byT5R0pp+x3GGlwztIAJKnQQBJRvmCmDz29qQ5VimGtzFy83z6RyBtOkwdXeNuJmKc4fOQbN25q8NSdKlFLuIALbcAAEjUTG45iKXKWSq525X3/c5UyV7xbTC6tvUWGloWTDCAB3JMb/3qWfNastaUXTZZgGuKpJUAcEmNj0oPLM1RbVy6iMyEgBmIlNHyj+a7G/Gwnvu3y7LP2i1soAaVY3tPiNG8lonjYaRyO1NreqTX5pkyVoqzRFu27Vu2jMoVtMqd4I3JI26b0O+XNuunSy+baBIA4k9N6PyZXsv+8l0DFbehNQ67+XzAbgbgcdKKv37GJe4RcYgoFbQ6eUHfzclePUHTFHPwpLXJ/t/gir3Mxc+HsSbhuOqTM2wWnUOgjj796g1gne6dAGpzp5UngAegFF4/G3lVzYuNdC8FiGIAIUsIMgwxOwjYGK7ILlpl/e2Dv5WJVhJgncnbidqTKcsbvTcdq9POyPQowmKwRD6ULXLm0uI1HfVDHrAJMUxOHsWLJuQny7qk6nJGmHXtBiicZ4WHVbaEN5te4CgTuFgbAECJFZ/NcJYu3G3cKoME7DeDA6nfb2FOc7et8fQkHx2CFyybylLWpiFtcECOg6k/5zTU5zh/2bR4aq+gQpiFkRJ7Ge/elJsPetvpgBQTJ4EcADqSYAHWsvluFdmuAsofySGOkT8xE8bRG8cV2GTcW+CIvlmrw+BZUeR5eh5Gogxv9xvtvTD4hz1lC2QvlGHtqG6y1sEnjoSB9KDxrqlvwSLgdt0iCiyAdhP8QMHiDS/44ukXmEjqu38pIE/SPtTOmbpplrA72Rg8Ukv6Fjv9aNwFg3rq24gkwSN4g7sPbc0BeXR6ww/vTzJ00+JfHRWYHsWEfeC1aF+79PmNxxbnp/qaHPb6G5bw6Qi+VAoInSIGkd24H3NbTFfDSNhrQ0i0LfQ6pIO+5H4jMk/zVlfhFLeFwb4u4FOIuLrRmglEMi2qA76nILGN9J7b1nz8SY12LNiLjg86mlZ7i2IC/TasjN08puscvhb3fd+ZpPrJZJp1SpKuaRbmtg2mcrJtK0Kx2JE7T/xVNnFtc8iHVH1/OiLaX7pUsC0g6WgAQInyjaOK1o+H1RmW0NgJJgTI9tuaZk6jwopS5LODp8c525UvIx9vAyGBJlTBHH1EdxRmCywDQFUDzbn+pPXimuKy3SwuEgalII6nby7R37xzXuWXBIB536GO3PHWkzzSatM08M+jjJwi1a2KsC2i+RHytqA4lZmB9NqaF7uIt3PCxDMrGHVtiswYjpEfafelGbNpvq444P0j+k/lT+zdKudLa2JWE2CngPqPcCJnkcRQpSfvJ1x+Pn/Yyv8A6HHaxzXqvoyGEyO0qEM6eHcZZkldJUMxngAeWfaavwjWCot3ALiW9Om4WBUDXyD1JJ4HVwNumazzB3r1w+ddJJKnUNKxJ0kfxc+porIMIgw13xwrKbiSmohhpPO3O8T7VYjFvdbHmdTWyCcbhbkPF5iWJhSSACXEArMDT3HXvVmHza8b4V4DLbgMTtBiZ7kyZoXOLqG34lpn1MYjmIgH13J2/wBP1qdm0165GFbW6aS2oBZMQGKseFLHp0FA4TfusnnkIzu9h7dtQED3rzRzpEsSmvy7QN/X60DhsFat22vKFa9d+TVquMoA8wgLpL7NJ4q/G/CuJueGzr57Z1apW4WhiSAJ2PXYfelGBwd+9fJW8DeSFQmFJAJ1MAON9iI/F603TpXl+BMkt6C8qxFn9pfVbD22IJVidiwDahsB17bSaSfEmcG7cdbaeHbDHyclmHl1OTydhA6QKOxOUvbOx/erLN0GkjbaOQDyNiBRnwt8MMbgxBkqgVxK6Qz8wCx36Qe56RRQW4C34DkxN6wtqyIu24UvrU67ZI1bsW3Gx4gwPrWnwGVc3Na20WNJIHAgknjYGRv2rJ4DLsQ4uLGrxXD3G1A7eYwBzCtpEbTB4itNm9h2sBbdrVG76jpJAJPKkcnfb7UyEJa7luHKKQsx+HsIP2hrouxqYXU1uxDA7GEII531CKwWYXEZNQcs4aAqSFiZLEkSNto5n2rZZozNYN0BShUJcUNCrvPP4iDO/cVlszwaWf32wtvBRZk/inbsCsSf4hXJJyugbQfl1kvGtQRplPNp8oOn5YMbgx19a6kiZph3bReWECghlJJLTuAOFWDxHI5ryjcX5BqdG/a2LeaYi0nlQQAo7eX/AJobMEBsYu9A8RLdvS8Qw1ldW/Xge3Sva6qy+NL1Yt8CjIsa58I6t3VyxAAJ0gkTA6HemV++4wRvB3FzwgZDNuS25ImGOw5FeV1M0xcna8gofCWfDYF7EYBLgVkuC6zrpAViRyVAAnyj/DTPKcQbmNxCuFZReQAFF2AcqNO22221dXUmGyXzYD4Mv8W4u7h8XFm7dQBVYDxHIBI3gFjHtVC3W8C8ZIL6VaNpAtuwG3G4HFdXUc0rREeQX4SvscRoLHSVMidjuOa3P7Qww6HUToI0zvE2nJia6upUn/uten7hrgzmZYlyAC2xVienC6hx6709w9hTcw9sgFHS2zL0JLKCfsT966upX/FfP9CEIcyulbIVTA87wP4lYaT9OlZPHbKhHLwWPckHmvK6reLhE9hp8N4p7joHYtpNuJ6eYD7elWfFjE4u7P8A8xv1rq6mR2lIsYPifzMhmQ3/AN39K13w5hUexbRhKuwDCTuJH+feva6rN/7aLeL48n/l/QaYPLrV4XBdTUEA0CSANI0CIPRQB9KX5BlVl7iqySD6kdT2PpXV1UIt0Pxpb/Nm1ynLrVpCyIAdNwckxHEAmBUkxj+EIYjV4xMbcao36RA2Haurqp5EnJX97E9TJpNen7ibMuEPdZPqYof4d3Uz3P6CurqWv5R6P2fFLo4V/wBQfO+D/n4DXmfXWVwFMbJ9f3Sc9+vPc11dVvDwih7c/lx++xzYlmtW7ZI0sWkAATDN1AnoPsKb51ZVbWpQAdQkgRMADfvsK6upz/4/fZnlH2BsSNVu4x+YOIPHLtPHNKsTcKm26khtXzDY+Xjf/cfvXV1Jn/NQnJ8Z9QwI1KjEsSQCTqPP3ofZWaFQFngkIoJ36mN+T968rq1nwShB8aWlUm6qgPoJmBBO5krwTPUijfhu4WwVpm3PmO++4Jj9K6uqtJLUyRP/ANP8QzF7hPn1WlmB8rNBEccAb81uM4cphrzLsRbcg/7TXtdVjF8Ib4MV8QN4eTvo8vmQberKP0r5vixyOg1AewtswH0O9dXUL+JC4cChF3rq6upoxH//2Q==',
      verified: true,
      premium: false,
      completedJobs: 54,
      responseTime: '< 2 hours',
      languages: ['Malayalam', 'Tamil', 'English'],
      successRate: 96,
      lastActive: '1 hour ago',
      badges: ['soil-expert', 'conservation-specialist'],
      specializations: ['Soil Health', 'Fertility Management'],
      description: 'Soil management expert specializing in sustainable soil health practices.',
      certifications: ['Soil Science', 'Conservation Practices'],
      equipment: ['Soil Testing Kit', 'pH Meters'],
      workingHours: '7 AM - 5 PM',
      emergencyAvailable: false
    }
  ];

  const teams = [
    {
      id: 't1',
      name: 'Green Harvesters',
      teamLeader: 'Prakash Sharma',
      teamSize: 8,
      specialization: 'Rice Plantation & Harvesting',
      rating: 4.7,
      reviews: 45,
      dailyRate: '₹5000',
      location: 'Punjab, India',
      availability: 'Available',
      phone: '+91 98765 43220',
      email: 'green.harvesters@email.com',
      image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUTExMVFhUXGSAaGRgWFxgXHRcaHx0YGBsaIBsYHSggGh0lGxgYITEhJSkrLi4uGx8zODMtNygtLisBCgoKDg0OGxAQGy8mHyUvLTUtLS0tLS0tLS0tLS0vLS0tLS0tLS0tLS0vLS0tLS0tLy0tLS0tLS0tLS0tLS0tLf/AABEIAMIBAwMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAAABgQFBwEDAgj/xABIEAACAQIEAwUFBQUGBQEJAAABAhEAAwQSITEFQVEGEyJhgQcycZGhFEKxwfAjUnKCkjNiorLR4SVDc8LxNBUWNVN0g5PS4v/EABoBAAIDAQEAAAAAAAAAAAAAAAADAQIEBQb/xAAyEQACAgEDAwMBBQgDAAAAAAAAAQIRAxIhMQQyQRMiUXEFFGGh8CNCgZGxwdHxFTNS/9oADAMBAAIRAxEAPwDbRXaBXakg5XaKKACiiigAoortAHKK7RQAVyu0UAFFFFABRRRQAUUUUAFFFFABRRRUEhRRRUkHKK7RQByiiigkKKKKCArldrlBJwmuV0iioIO12uUVJJ2iiigArtcrtBAUUUVBIUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAVyu0GgDlFFFABQaKKAOUUUUAFdFQuE8TtYi0t20wZG5ggweanKSJB0ImplQnYHaKKKkArtR8Zi0tLmcwPqT0A59fQ1WntLY1gyo+8viBA30WSIOkGNdqXPLCHcyVFvguqKqcH2iw91gEcFTENsCTAy66zqNPOrWphkjPtdg01ydoooq5AUUUUAFFFFABRRS1xft9w3DXu4v4pEu81h2y/xFVKp/MRQAy0V54bEJcRXtsrowBVlIYMDqCCNCK9KACiiigAooooAKKKKACiiigArldrlQAUUUVIBS12z7XYfBWmzXVF4j9naEM7HSPDO3UmNJ1q17QcQ+z4a9fylhaQuQu5UatHnEkctNSN6/IPEMc96691yWdzJZiSzeZJJ1+nTSKq2BdcS7ccRa67PiLisWMhLt4KDsQALkR8KKXS08qKikQfo7sxibh7hbF61cfIczKj2xJgIbiM2YgW0O27Ebe8NGFfnPst2iXBZLpVXVXCywHvBcoJ56ZiZ0OuvOmTC+25hci9YUJMQp1A8jsf8AasuGem1T/gPyRNpmuK4OxBjTTkaSx7RcHdwV7EWbil7dssbLMLbg7fejSfvCR06Vh/CO113D2Llm3ckXYLTqc4IObMQCCYH+9aJTa4Qo/QfbHH3ES2lkgXWce9IGTVT4sp+8VGmssu01n+N7R38xLPv4AbZNu2TLALncCEzRLeEmH6Ckbg3bbE2srPiGfJIksG0JBeQd5IQfCR0j44v2tzrbJY3DbYiCAoEENmUKQcrBFUgmBqY1ArLNPI99n+Q2DSQ0mxbt3msLCrbALXPEviYGYkqbiAzzjUGFgAbFwDFqbCnOpAlQdRopK65tZ0358tK/NuH46WAzXIDk5iI96Cc5AIzHqd5Jp67I8eS3byM0qCWL6iB7pkmZgwPKV61mlkfTz16eRtKaqzWMZx22hyrLnnliBrGpn8KMLxpWgEQTyE6fMbfClPVjO8wdPONuteHE8VZtL3ly6iBWGUvCawREsJE7mPKhddkk7j/IPRiluaIl5TswPrXpSNwTjNu5az279q6FJztbIKg766mNORivOx2+Q3WtKRcYSBuM8anKYIJHSZ1rT9/jHuT/AIIU8Pwx9oqDw/iaXRpIPQ6fjS3ie2LO9v7OqFCZJuTLp90qUMLm0YEzpEgctcMsJR1J7FFjk3pS3Lnthi3t4O+1s5bhQpbPS4/7ND6MwNYlwzs9w5mZb7WzG5LFWkmM2f48zzrXe1183cDda2PFaOZlblki5y30ysPIisq4ddvXO+mzZdSnu5dTEMDyEaSee8coV1EnVI1dJBbtmh+y7h5wgxOEW41yzbZLlosQSq3VJK6aRmQmdJLEx1e6ReH8at4WwMQ9sgXSltUXUwubYncCTVjiu0a3cKzKrIWZUEkT4nVDEeRq+LIpJJ8sTlwyi20tkxh+0D/SvUXBz0rIsV2+nFdxaVXkhVZlLqDG0BlkbmTp6ias+Fds7OIfury3LDoSO/tAoFZTBVgSSqyeeZDEmIpkpxUtItYpadXg02isu7ddscRg2tYZbudj4ncABwMxVQYt5Qra6gSCsc9ZnZHt8Hj7XeRVKyGYBACNyW0A6fH40mXURjNRaf18EKNmi0VRcN7YcPvgm1jLDQQD4wup20aDryqevFrJ91w38Mt+FPbS5ISsm0VWXuNoq5jbvR/0zoOp5AetR7faiyzqirdYN99UJXyMj9DnFV1xurJ0su6K8PtiagGSKpOKdrrVnMuRyw0gwoJ05zPPeDUuSXIKLfAxVHxePtWv7S4ifxsqz8zWYcW45xO4SFuRbJmLCqrBfJyZO/LpSB7QsXdW1F5HY3fD3jvmZSpDAGV+NK9aLdIZ6Mkm2WHH/aFjrt/GWyXfBi49q4LaKwTDlu7mQog5Q3iZ9SwiN6zdr+GVrwW3cZTpZLuFKeKQ7hVhjlEZZgSdTAqAHPKa+Yp1CRg4b2Sx1+2t21h3dGmGCsQYJB5dQaKqrPELqqFW5cUDYK7ADnsDRQA19qOGYu2WIR3tXI8aAgALJKEKxAjLOY9CeZpTFliddBMEtIA1A1+BOtb23E8/hfA27q9bhtsfI5csVTW+GWgXJ4fa8Vwspz2pQZUQDMy6+6zFdpY7nWuNh+0YxjUlv9Ub8nSScrFXg/s+uSXvZThyhYOGykkqCpQTJOfwmdND1Bpb47wm5hnKsyPImVMxrAGaNSD05zWy4W6yQRhy23vPYY6b6lc2sddOUVD7TYW/fyNawtpCoae97pwQRpAAkMDMcoJ3quP7Rbye6q+qIl022yM74baRGi2mZFOXOYDXX0zGZlUnYKQY3kzDLh+Gu+bvbBvW2g5TcYsq6ZgGduYkjWZjUiQVSxiz4boSczNcyiAoBYmB0+Hwpsw3aZzlU2nUMubMpB9Yrpzm0yuHDCUbfItdruCrhbjWO87wFBdtMwgi2R4VPLMPH6qCImBL4IWIWymZrreEgAzkkZzDjKNPop9HbsJbtXLcXcMl17Ray11spOXMWVROoUKwWBHKmqxwnDgD9go+WmgG3pXL6rrYRk8b8Fo4nVirju01rBuLKp3t20gFwljvklQBuR1OnLes7wtq7xHEG/iLhOZo8I93yAPuqNAB/wCTsXajAL9ixBt2wXFpyukmQCQADp8BWO8PtWe5BNwqVEBRO53bSNZ1nyFO6HJB42488Bobmk+Btfs8uAtXMRavOTkyOhiHQjxTpqRuIMyIkTXhwjEKqFLS5ALpUsGMwIBOY8iekCpV7hq3A4S+zBwh7ssxBkgAqG094HUa7yNapcFiAltxcti4xLCX18TMQZIBIMgydq0Rlab8j3jUMilWxpGMuMmFK2rrSIIIMzrGUnocx57gUo4XGKt8oMYVUpktgKfCQAqesgfOrLhdxJRVt/tHthfAzMPDCrOgDDeCNo66B27I9kbGBF28+U3GdyHYg5LeYi2sxvkAJO8kjYVOGGq4spnmoS1ryVXFsZicLgXhs92+ASSMpCQlsnLl0bKRuB7pPLVX7MYe9mIF1kUaMOoPx+Fak1i3fJdyACIC88vKQxyiZOmUnz5CDieydpmU2zC/fVfvDXQGfD0+HnvfLjlJVFi8OeEW3JC1xnhuJxGEw7ILiG0zEIMufJIGkkSuUK4G+VgOVV2LVkwuLtq9xri+NAxU5I8aqCD+8vumCI85OkH9nJ2CFT18IAVv8AHyr74j2fs3WLlBJGurCWHunwka76/CrzxuO8eUUWZOLUuH/Uw7gmK8SR4CBIKqCNCAcxIJkmTEdToKbhjil1i1vMCyklwA0CBcAyiGV7bHL5kiBAqh7SoMNjLlu3bG6sFOsSAY18zTBwV/trol+2EXIWhCQTl2JiCFDFRHmBtWd3JqvJrTWht8V/YVPaMLbcRhGdmtIqkAnQooJjLqxAnnqeXMqXa/DKblhbObu7lsXBm3BMq69dGVuZ0I9Xjt9g3scTZ73ht3CCrK2TMAEQyy66dPhS/xbACO/N1mtoptC4NcgzZlUdRGfUdaepe5NmWlLHpRUcD7FvfJD3Rb8JYeAtyMc9BIp17Kdrblrh1nMGuMzOs5yrFVIA8UGPejr4RSthLthfs7jFXUuC4QcueQuhBOo5yI19RXt2h4M+He1bNx1R81xF1i3mdsygfdgBJ+NQsnuqT38FpYo0nFbedzVOCcbN4yUVEBEySxAkDcEAb9NKofaf2nayxwlhihIzMU8JaSREjUAQxMeXIa0fA8lnFqReuZLg00JV5ENbBOn06H4KfG+MNibjXLhUXC7AkToA5OUyT1B06fGjC/c2w6iNJUMnYJ7pvoWvXRzP7RtRtvNaJ2swDXLaXUILqcpbmR90xsSJIrKcLatvhs0or22BLKs3GUg7+KY0Gw5CedaDwnifeLZUXO9EOz5IUNogWQigKVJCgCJjyqmeajFt+CsIt1sU2Kw962Az3bjRAgEwRIOgg9BtUDiTDEJlu52QwRsPFrroRGnnTvdu24g2CJ03c7etQme2IPd6CIDqzCNwPFOXc6CNyK5kevhzRpeOXhbCF/7hh1LqpAkyGYkjmCY93100qu4j2btKsyLbcgGBjYRJMt8ecitF4vxjmlgFj+87gRPQgzv8Nq+l7Q2h79wW2HJlnMT8AQdOtOXXy5p/l/ko8EV4MabAryOnwTXz1NcraruOWf7S4fNbd4j0gRRVv+Rf8A5Yn7uvk80viAS0Expty86kYZ2JOaRHu6r4uo/AeopCt8QzCFYATB0knQ0NxWPDOg15CJJ56/oVzX0UmavvSNGtsxkkEc40Ne1vFajX8R+txSr2ft38TcFu0xHNidkEjfznQDcwfM078I4JbUmbj3XyZlOy+TADnBB1bmPScX2XkyvbgrPqorkx/tdghh8QyWcy23EkH7rFmLKNPdAykDXevW1evlURGR2MKO7nXkAQd5mR8fjT57SOy5e39pswXW3nZd8yKASOs5SxHPwis0TH3RZ0cyD4dNQeUHlr0rvTgo0hGGcmmzYeEcPt4dMiHSSxJMkseZPPkPgKnG8BGoj9dK+OJcFbulv2AWLKGa3InYGVn8D/tVZwq3iLr5FtMeuYZcnk2b3fhuelebz9Fm9Tfdv8xyzQrcu1uiOnpv5VkvHVsW+KXkUIFBQhWVcqkohIgiAK2nAcDyMrXGlhyX3djzOrfIb0n+0TsFbvW7uIQEX1LOCu9wb9207zBAPIkcpnqfZ3QTxJyns34EyzJyVHj2X4fZu4sMmRjbt7JETmAzQIGk9J26Uudps1jiF9L5zLcJuIQZZUZtFjcREDyjzhy9mHZp8NaXFXQUe7Cqh0K2SC0sOTMwVjOwUcyauO1vs/sY273/AHjW7uQJMBlIBLAldDOsSD0roQxUm/LDJkXq87Iq+wl1LzqwUkIpOZp0bwAATvoST08PWvn2rcYOGFkFiFbMSonxxBCeUtkBPJWamPgWDt4Gyli7dtll2IXuswJJByljr111IpY9rXCXxtm2bdpmOHY3AYM3FhSyKoBJlTI21QiOdPjHTChE5652K3Zm+HOa9lbYkudes/MTA0p7Xjy27lvUm2wOa4g7zJEAHwycknXcCQSIBjL+zeFsC+CyOQwNtiQNWOhGp5GBJ2nlT92MtW7eIFpbfdsA0wVKsIADKR5ZR5aVjWpTOhkUZY3+CH1il1MysrK4EMpBDKYmCNCCJr7ZmygTMCJ6+Ziqnhz9yptGA2cxA0YkBzpy3YR/dNXUV0o8Js5EvgyP2n9mrqsMXaBIGbvYPKS6v5ZZYHyjpX37LluPbxF9lIVO6sWzzJNwG4fT9mPnWr3rYIggEHSCJmdNumtUnCOE28PZuWbQhO+UgSTAAtaa/wAPzM7k1V408mscs1YfT/VFh2g4Jh8UgXEWluATBOhWdyrCGU/A0odpOxNr7KyWiV6Zhmy7QNIkGAOu29aDd2qBirIvWrlsGMysoI5HYEeYb8KHFPdoopNbJmP9h+y93E3wmJKrbsuHK5mZmImFUEQqzud+UayL32s8HQ21ut4WRz3e0MGiVmdPdX5eoSu0XbXiODBtC9aV390paTvEQHL4jESWDD3dQJ0kV88L4fexXDjiL11rlx3N3M7FmhMyKJJ2BW5psM1ZZYVJqb8PwN9R8HMBds27AxFweJHARVAk66yOniA9TUj2g9nLVlbGNRRnvOmdG1RmyHNCjlmEnXWo/ZLsFiftKtfAt4VGzhmZQbkRlCqTm6GSI8O9M/bLFJi5tEDIijImdRCz4XlWIBJB3IOgGkibRioy5L5MmuKVCr2YxN83jkKqXEZRbQLpMKVI90STI186fMGtvD4TMxVLjnMzKuUbkxlWAN40FKPAOzDli64sJpEXQLba88xykg9cuvnT4vZ5nw6C1fsXbq6EK8q37uo2IAM6bDyJOTq4ynFxgMxaVTkV96+WyhSskfe6dZHKoffGWXNBXcamdJEbRyqTfwmItH9vbVDrl2aRt7yyvInfmNqqmxuZmnKOWm53k6864Poyi3Frg3RkmrR83LxAViQZLEwvunlMHz/Go4A2Z5MaaHXTWIHL1r6fEW8x2AJhgY56HnVbhMVZDMCzxOknY8x860Ri2uCXNJLcaMP2guKqr3mwjVda7Stf4q4YhbrActAaKusU/wBf6F3AhC9aZYLbwSRCmI1kka+lQ7dhFGjZm3KwYnVV56x+dQ0stmEmc06yREmNdKtLFkAtlRQNQDqdzB32jkelb3HRwzmuTk+DQPZLbNvDXneCxds2vJVXKNf4rh9avuDcRGRmzlmsXlsPB8KyAARpEHvEYmDGo2FLnYq+Fw+Nze6g+gs5j9DVp2Csq+FvW3sdyLpkKzA95ChS4jUzEywkzO0VuwS9pWcRowkugLAZrbEEco1WPlH1rDuLYBLOJu4YCcl4gb+7IYb6+7H1rZ+EYjOLilv2i+F5EFgBlD+pGafOlXiXCEXid6+VnNatso6u82CfIKtvX+OrZWqtjMLd0vI82by3MJKMCrWyFPkQQDrUHsHxBruBtXWkd4C2u4Gd0Uf0qNute1i4Bgk/6Q/yiqfglw/+y8NkOVjbSPIsfr4gw+DUQabKS8r8RwDzlJ0nX57D5VIdARqJ8qiswmOmn4VOWmRFshWsGEtZQSRJYSWMBjJAzEkLBIAmANAAIA983h/X6610+4QehHpqPwqNdvRbJPr5EaN8iKt5IO32EgwJBgGNetfOLvhQWOwE/r0qFYxwInmJ/wBfwr3uFcwDRDGDP0HqdKhyXBNGL8K4nauXmxIZbRd2aCNVDHNIaeZJn1pj4TxW2/FUtWoYiwxL6gFi9rwjkRlHTpB3paxHAzYvXEnK1u4VA6rJI9MpU+tNHAODrYC45iFLuq253IGedNJk6x0SaxRneTg6OSDjhVvkbO0QbvEuIDlzWi0AmJcEMeghGGbbxUwYVQAKqOz3EM165bZCuS2ieLZirXTpO8o6N/NGsGJ1hsrug2U6eQgGPmYroQnao5ko0yZd5fGoODceL/q/ktTGNLmFxZF66pPhNxY8yQFj5qfnTIq0yrGl1kEVWcMxqubiqCMjMp82nMxHlmJ+VSrWKR1JUmVmRJGseW+hmkL2fcbe7cxAZFCd5dYMCdc11yAZ9flVEWMY9p95m4nig2y3Cqjou4/En1rRfZffQ4WzdmVQNaa3P/MzEqegGQyR1g9Kzb2lmeJ4o9WB/wAC1ovs04Vk4fbGzYlnaegju1HyE/zUuftRMd2aFiuJBkGUtIvJbORMwJJtzqeWV9T8aX+N8FuPlAF1iMwEd3byjWAqtvJA0bSCfKoeA4ml3u1ZgpvXO8VWZwfcsgCFHKOtMuMYd4hAX31GiO25A3O3xrCm73NDVCjwh8dhbmVrCukZjFxLZ5j3LhhmI08L5YA25M/B+PO7O0MNcvj7vwkQWUZGI0DieunOrHhOIH7eAPDeymBAkrbiZ13IGnUUt3Mz4jFhTCoe8PLUW8OT9AatywLi5hGx1prOIOVszFHtMSFIdlQlCdZUCQepjrWV8Tw9yy7rdVQyuVOXXVdc3wM71ouLYW79tgQCRlzBsrBredTI++nizHz9KRvaAzd8l2SoxFlLoBH8sfxBVU/E0ia1P9cFrcVaKLDcQ0JKg+ZHXSPlHpNQ8ZaXvMy+EaZ4O8Rt00r4wbR4ZnXw67QDMjnXnj75Ctz8+fQURhUtiJZG4+4kHFWeZP4fhXaXQrdD8pop33dfIv1pDK+ICzECdR58p8hr+NHDr+e4FZgMxEkyYE6+c67VDVwSMyAga+Wk6fCvLG3dso300jbTU+vX1qFjXBDl5NP7IWS+FxyKNWe4IkHe1aAE8xGlUWC7dPgrt7DXkc5GIV1MwpXwhkJggSpBB9DtVn7CcRnTEKxJOeTOvvKoH+Q0s9s8MBxLFKwJA7tjETBs2iSPgeXTpBNXXsm/oNiteyNS4DxfDY0i9YuKLixpMMumsqTJBiCp5iR5QOOcaV3dE95WW3oDrlbMSJ3GYsPSs4wXBbbQ9vK1xCCNIkdCp2PntT3axiuiPbEBDqsf2bjkRynkfKPvaZ+ozKftRuwdO8b1MvOAcVF/hzwRNsup+Grr/hIqouYxrXC8FdWNLamDtKsLqz8Cv1q37N4W0uAum2oVXe4xHmZkfAbRype44hXg+HT91Mh//Gn+prRi/wAGHJ3P6sfreKbP4hBnb02+dMNpt6V0xGfJcGzqrj4FVP8A3Ux2219KdDZ0JfB9XxKsOuh9YB+hqISMrgGIY67+9DnfzapOKfLHm2v9JP5VTcWxQW1iyPu2e89QHB+irTJPchIUVxzC2zmI+0Xbem0KsCD0kGnY2luKQdQayM4wngtq6f8AmPeePLOyj6KK1bgz6EHcfnWdP3yLte1Ct2k7F3LjIbTsZdVZmeSqEhSZOpyiSJnpsFpj7T8GU4VsgH7Bc1sNMAIJCiPdkCM3LfWrhwB4oErry5gjc1KZMykTEiJ+I3qY4luWlmnJJPxwLPDhdW7md8+ZdCUCmYSM0aFhL/WNKs7S/tWPX8iR+VfV7DraFpBsJj01/wBvWvC1dGYea/i7UYNsjj+vBXJurJtzakS9dxNrG5Gtm6jMLiZcoy5c0yW55mWPMDanvNp8a+fsqkh+cVuvYRR44YgJouUFQR6gmI5RNZj2FOS3cVV1dizGdZzsDp0gaf71quLHgMch/vWS9mX8d64QQqu5jbUs9tR5wFut/OlTjXyEjN/aShPE74A1PdgDqe6t/nW4cHwGXCWETXuCF+OUZT+BrJcVZGI40kDSVc/yCRP9IFaTheMWrOHxHfEzbbOMpOobQbH94Qf4hWPqpVaG4lZRWsRk+zsGY5XunRyNO+cqPCh+7A9Kb8Ric7WSMxDXAdRePOfID1rO+G4rPYw5LRptmOkkk/8ANH4CmvDXVOIsLIOU6aTqAf7zday+f5jmXmKm2uLNsftXutlAYy2iKvvae9pvUTA3UuYjGPb9xxOum6orSN1I0BB1BUjlV1xIBbiDwjPdOoOVubcgZEDWTEdNIo+HXIbGvl+7lgCJc3biHTqWWrR8lWUvafxPaXUvfu3rKa+73jW0uN/KuYz5Ue17BZksXUICWmuWo5Ge6ZR6ZXr3vuv2uw7f8i5jHA5ZicPl9YumpntCwofgneg5ilxLsjqz92dunefSoW7LT7TKS42jUdKiXb6wQd5j8Zr5N4x7scvX9CPSol9fEx5T+P6PyqYwEOZ1s3ILFdrqWSQDNFMsqelu6TEz/wCdQPr9RXMQGysQfumfWT+VAKlco3jTrOh9eg+NF5yttgTqVIidtCNv1vU1uSh69gTxdxQ6rb/G5/rUn2l4KOIFk0uGzbuAjcxmt/TIJ8m6VV+wu4Birw6ov4kfnTX7WEPfYZ10fI2U+alTlPkQzaeRpebubNfTdyQscFZHiB3d0CYQEhurJBmOqQY+VSsbiSs3EYh9Ax7srmAIIDZmE6jQwY9SDVYXEW2J0KycxXnbf99CNwfL4Va47iH7Ik3UJj3mCs5+AGvzrHK1LY6sd47jZ2Cxhfg91zoc970/0qF21wk8JEfcuLzI0yMpmPSvPsDdjgV9hOhvnz2J+dXXaK0H4RieUKX/AKGDH6Ka34+5o4s3e578BLDB2FbdLOT+goo+i044dpj4D8KTOFOpw1kruVdT8YaT/hBpg4djZa0AdLlsn1B/0mrRfvorWxbcQHg8wy/VgD9CfnSt2qaMLi2Oxwl9Y/hzf/1TLxW9lsux+6ub0XxflSx2lU3sDdCjVlxKfNMQo/xRV5clVwIPaFe64JgwP/lAxHNkDEfMmtY4bayqJ3gT6Cs57VWxcXh+HQzne2P5NC3xhJJHlWoWU0pUN7fyy0n4PTKCpnXX8Km21gCoiW9hvUpGPlTeChW8d0a2Sf3h88v+lQMUhHd+akfJgfzNSe0VxhcsjSDnkHr4IM8ufzoe0CqGIh+fQgj8YpWN/t2XfYet5vER0H5VJw7SgNQC0sx61I4a8qR61vaEH1jLkA/A/hNZPwlwuDLsB4mfTmxDm2vqVVa1Hil3Kk8tjWO4LHKuBZlZs/iUqVGjZmGZTv160zEtysyp7BOrcUus5WBZaeQ9+2DE+RPyp84p2dwhYjxjvFykCFDq3SdGGx8MkEAiCAayjsjxIYTiFm65hLmZH0kZWldQdwDlJ+FbVhAzh7ZUKkyDaDID/EroCOW01zertSs04eDNey5bJJdsq8hBE7GJ05GmTgl+4+NUtnyhSYKr1UTPz1qmw+BOBcWb6B7bE91cIch48gdGjqNRqKt+EITiz4MoPdqP2ce8/wDe+FKk0rZdKxr7bkg2WzEAXEY69ZQkQNDlY1Q8LvOvD0Yy1x0DM3VlZ7xP9bD51P7S8TP2RnKyV71fVG8AgfEVyxhwLJtnQW0cfGGKn5q6ilxkX0iH244qyYkBZzZmcAT99LPL+U/Knjs0FxHAb+Gkd73d0ZZEhjmdPhJH40kccs3TxDMltGXKLea4CyNq5ytHuySq5tIYDzp17GYm3Yt4l1td3byO7yRcCm0hlc0K1siZyMCd9jTeKoiW6dmMuGgA+kc41n1rzYakbxBjryH41I+1GUzCNI19I3+H1rl29E/P05eulXVmZ0eahyJAGuvOivZb4OpBn9eVFBFIrTeg/r41y+5IPqK+RB6D5x+f66VzMdZ3/X+9Ooga/ZNismOGvvJHqHQ/hNaH7VW1sHLI8csATlEWTBVfEVJ1zL4lIUjmDjPZ3GmzfS4DGU/r6xWue0u4+WxibZI7u46kwSIdLRho+74Kz5l7zZhdUxKs4e27aOoJ5ZrbyfiGU+hUGrl+EuFIKn1KqI6+Ekt8DFfKYqxdUE2SG5wsqeviH41NTEAjxOIjkZPyG3xNY5yd8HWxJVySezHEhY4PiVYBlz3QCDAkq3hjU/dH9Qp8wVgXeHuh1DrcX0JYVjnHsFet4a6EtRaJIVy0eE5SRlG5zZhy9a3PhOFb7OBqJBMA6yST+db8StOXycbLtKhL7FYwvg7I5h8reReRr0MOauOCXobBSfvXE+IzXQPyqq4HhhawrwPGjl4GxhswHxAA+dcs4vIuBPL7bdSf/ugD8TUJftCqexoHH/8A094beBvqDVFwRjcwKMfvO5P8z3B/3Vb9q7wXC3mOwRvwNVfAbeTBgH7pc/CHY07IiiE79qeIYEOEDJbdmjLuLbJvJY6uDJI3FaTg8XmGo18qTMLgmbiDXiI7uwLfNgGuZWMHyVB/UavyzDVZH50mGyRMuS/tKZmpKioWFuEqJqYgFXTvgihf7a4jJ9m2hrpSGAM+BmjcQfAdjUuyv7LQc1OxHMTv5TVd7RruTD2bnJMTamRIAcm0SfgLhM9Yq1waQnuxI1B3B/XOl1WVSL3cKKbhOIm1J5Dfyq34d7qmlfgGJDYYN1UH5gGmDCWC9pQSQpHLc10pOjOj346v7Jiu5Bj4wY+tZn/7awd/Bi1hnUm2sG1cUBpUeKVbfmZEiZ1pn7I4wmzcw7+/YuFT8JJn5zX557QWjZxd9ASpS84BBgxmMGfhFQp6UGm2eHGbxa4Qdl0AAAjy0rUOwfaQ3bKo+JyXB4SHdibg0jLmkGdoAmfjWRXHLEkmSdzTlY4Eww9ttmy5obz1gj12rLnprcZj2ZpHarCXb+HYAuOmfMrFxBEBwum66A+8fRU7K4wC8mcye9tL4lMghjIJaIIk1N4B23RbdwXgqXFAARg9xSBsQS4I51nfFOOvcvXLihfGdZUMDtrDzGw86ywxSdxY95FszXrF8vg40yviWnyB8cj+lt65x3iDgG3bBztBvN+4FgNHVjFto00B1Eisy4f2guLbZUvQ9xlJt934VIDeMGYzakHTXN5VpPY7HHEYZHbIGl7N4ZSYbwsrSWkkrqWMgn1qk4elG38jLUnsfGA4fctWbDsFyLcNpwk+O28HMcxJLI7sJP7+vnWdo+IWxZe5ZIP20KujDMFBls4BOqkZNRs5gxVz2hvXLXC+9tKhC3Gt23VpDI6wWABIYZ1ETpOVgNBWYXEI8WpiBJgyRAMeWhjppRji5e5lMk69qIuOuLLEbmYmduWm1EKoBObURIgkAzrB02ii/hh73ppy0jQGu4lQAPLTrtI+mtaVWxmaI5tTrmUaDST0+O9cr2Y9Ij0oq1ldJXWmM/hXswjodvwn5jb0qOjnaTHSvsXKY0B8IdDW/wDYTiHf8OzuAxY5GB2Jyqp/KsCtYZmzlFJCrmaOS6CfmRWnezHiZt2xZYCGcMIBgc8xJ0zElVEcp050rMtrH43aod8f2WwFm811sNaK92NCoygjKoaNh5xvRguz+Ha1eS2ihszKp3KwRpJ81FTu38/Y8SY/5LASNyY0+lJfsr7SK1prb3AGB2aPH1iTvqOu9Uat2SpbUe3tUxxTDW8sKSyvBjcEHLHMTvygedJ1n2scUChFuWlAHKyhn4yD9KZO27hrsHVbVvSepn6xFZM1og/H8abjexR8o3L2ZY44nB3mYycxzSBq2Rcx25nlUbtGxTA4W4PucQJMcvHcf/tFUfsh42bVi5by6NegsQYlrNxlGnVrAXn74q07U4xG4VeUuoupi2yrzOUknTl4S2u2nnVGqmSuDQu390fYnB2cBf6iB+dVtzjKWeH3rt5oCm4rED9+4wUCNdmHyr47dv3nCwx2ZFP0msj49xa4cKMKSSGvm4SdSYQQvwBYmPIVeW7IS8Gn8P7R2MVfJsOHGRWJGYQdQQw02AB1FXSw8HXLpl0+prJvZLYlrzloHhWBziT8eY08q1bD32Z1UAheXQUhrTaJfIyYFCFE6/OpwP8AdqFavQs1LtGV57VMKIYv+0C8FwLjIGLsgVW1GYOryfJQhb+WomA4jZtIWS+t5LbMn7Mh2RRL5HKmCURTDNBjcknWo9szhsD3MMbjEOADGVbctcZuoCTp1IPKkb2eYNlwuPvMsE2SgO2pDSPQleX51aMfUdWXrTDUM3ZHGZrLJIJ0jz2BFPmHv5bI8lrIeyl4ywBiNfkGJ2+FabduHuGHRT+BrfJGZCvj8d9k4gbxB7rEKM0dSBr8QfxrJfaLcVuI4hl2YqfmiE/U1sXEbqNg7LuFYd3rm28I125xWEccv57ueIzCY6DWB6LA9KrIlHrhOGumJspeQrmKOAw95GhlPmCOdOP2tmtMCdtNKW+LcdOIxdvEZQsC0iqswFtoqR8dKu8KpKNHXXSseb5HYvgXcXhtSW0qp7k0x45NP9jUe1hcwA6rHz8hrVoT2Ia3PPB28tlmi22q2xJh5LZw67EqQpUk7Aj4jTMJwgYLDIZJu99muZWbK8C4iabEAFD5xPSI/ZPhlg4YXyFLiyVCsoMuRlRxzkSRrtuINX3bHiCJYW2Z17szGgDAKG/qU+grLPJ6myNTho2fg8eEWvtXZy7amXtd4UAGoNpzcRfVFA9aye7iJgiI2jpPP6fStd9lEdzi7RiO+XTXQOpBrIcBhzD2zAa2SM3wnMDzO0gx19Gxd3+BlmqYNzA+mmh157aA14Y3E+KBtofpr9a9MO0llMc/DG5iI6gzr86j3sMSC4gjl+Y15+VNS3FsExJiu1BIrlX0lQFE0Gg1YBg7IXQHuA81266x6b1sOBwydykW1+6w1K7ARGUGsY7JMO/IaYKEafFT+Vbd2YJNhQfuEr8jWbqOBmLk72ouNcwlzcDLscxPzbz8qyLsBZW53iEDMpVlkAyCcrCD08J+da/2qbLh3WPegAfE1k/s+EcQdP4voSPzqmN+yQyXchyx/CpDsRoQYHkBA0+ArNb+CnEW7ZGhcSPLUkfIVsF/Eq4uoI8BjU7nfXy8hvWdYFA/F8OkyDeUT+vjU9M3bDLvQy4Ds4LF9sKZ7vOl2Nfft6j0IaDUPtcAqm0QTcBzMT97MlxS3lqVMHr5U78RE4t2AkgAiOoI/wD1g0q9tTa95D4m1adz0/00q9e4i6Q5XE77g1mNzZT/ACisQ48j2WVI1Vi3z0y/CAD61tvZG7n4Pb/uqV/pYr+VZV2+tS80z94re1ouvZ5jrVq2VKe8JACjMZ1DFvvaabdelaF2XuBvFrGY79Jmsg7McewxVMPigVNsQl5J0GpAYDaJ36eY11nsxcUZO6dXtyVzKZ8xP1rPNOLtl71DXfu5RpXoOIlCixMkDf61C4raeMwBMaEeWnQH8KWuI8XKYx7ZYKEyFSykDYScw2EnXNG9InklHgZGKkSva1wu7dwV57R8Vu2WIMHMqlWcCR+6GbzyAUu8Iw3d8GbqyiT8SJ+lMfbfjllcMlxrtvMxYWwfddjauwsxlEtAliBvryrMe03a603DbWDsm4Loyi4YKhQm4mZJLRtpoda34GqbQibfDO9mbuW8fIx6HT8x9a1PEP8AsbsfumPkawLs7xsJeXvmhebkExzBIUTuBqJrUx24wS2TnxCFmTZMzGYjYCR6xWq00Jog47GluC3Au6tkPkrMJ+mnrWS8SI8HrP8Ah0/XWtR7EXreIs4rDkyl0SPI6wddiGCmsx4xg3tMEf3gTtzGkH8aJcAjxtMO9VoA8SkxpzB25U5cNJNpj5/o0jWXgz02+NaJ2eE4YnTf1mPlWLqO0fi5KHHwa+cC0ZTyHL4GfWpHESZ+98wah2j4Dv8AL9RUR4JfJpHZ+E4TYvZAfElotMEBrqiSI1A+POoPb2+jKcviAtokjoBdYHzgiPU158Cxf/B7KspKDFQQIjLkynNzI8RYRrIr24jwxbhFpdshBUEEiGYAgSNPEQfOekHJHTGTf4v+pryJtlv7LMKVtXL2YnvWgjWAF22G8mss4+rWcdiSAQO/uj5XD69DWrezotbDYd5B1ZQQV5yfeietZ37SrRt8RxIiA+W4OY8VtCf8WYelNwSucjNmWyKEYmHkb+9PU89vIn5Vx8Qdo0I/P/z86hMeYoz+kfr51s0mezl15JI0/X570V8hhRViDzG9dbeiipJLLs9/bL8DW4dkz+zb4iiisvUcIvj5PXtP/Zp/GPwNY/wxiOIXSDB8e2nNaKKXh7ZDcngscNdbuj4jqddTr8etefZUf8Zw3/UH+SiimYu5lcng1LFf+puD+/HppWY+0AwARoSTJ60UVMe8H2mhey7/AOCj4v8A5zSD27Pjfy28tKKKu+8r+6J3CBLeq/5taYeyN1hizBI8R5nzooqcnknHyjZ8NiH7s+Jvc6n901T9nWJxGEkk5sBrPP8Asd+tFFc7J+vzNKKD2pqBgsKAIAvmAOWj1muJrlFbOl/60Z8ncyD971r0tbfzV2itLEsm9nsbdt4m33dx0zEBsjFcw6GDrTh2ytg22JAJAJBI2MDX40UU6Hayr5M3NaX2SUHASQJk0UVj6nsHY+4W+J+8ajWGMDWiioXBL5HjhI/4Fe8sRI8jO9WXbO2O8VoGbJOaNZgc96KKwT739Wbfj6f2R9+zjFO2JQF2I10LE/dNLftvH/EE/wDp0/z3aKK09N3Mz9QZ+Dt+utA/0oorYZT6iiiipIP/2Q==',
      verified: true,
      completedProjects: 67,
      responseTime: '< 4 hours',
      successRate: 94,
      lastActive: '3 hours ago',
      description: 'Experienced team specializing in rice cultivation and harvesting with modern techniques.',
      equipment: ['Tractors', 'Harvesters', 'Irrigation Equipment'],
      workingHours: '6 AM - 7 PM',
      emergencyAvailable: true
    },
    {
      id: 't2',
      name: 'Farming Solutions',
      teamLeader: 'Anita Desai',
      teamSize: 12,
      specialization: 'Complete Farm Management',
      rating: 4.9,
      reviews: 78,
      dailyRate: '₹8000',
      location: 'Maharashtra, India',
      availability: 'Available',
      phone: '+91 98765 43221',
      email: 'farming.solutions@email.com',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT96eqL11o4PehR_IZtysUOee9ntJVz5OLzLQ&s',
      verified: true,
      completedProjects: 89,
      responseTime: '< 2 hours',
      successRate: 97,
      lastActive: '1 hour ago',
      description: 'Full-service agricultural team providing end-to-end farm management solutions.',
      equipment: ['Complete Farm Equipment', 'Soil Testing Kit', 'Drones'],
      workingHours: '5 AM - 8 PM',
      emergencyAvailable: true
    },
    {
      id: 't3',
      name: 'Organic Experts',
      teamLeader: 'Ravi Kumar',
      teamSize: 6,
      specialization: 'Organic Farming & Certification',
      rating: 4.8,
      reviews: 34,
      dailyRate: '₹6000',
      location: 'Karnataka, India',
      availability: 'Available',
      phone: '+91 98765 43222',
      email: 'organic.experts@email.com',
      image: 'data:image/jpeg;base64,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',
      verified: true,
      completedProjects: 45,
      responseTime: '< 3 hours',
      successRate: 98,
      lastActive: '2 hours ago',
      description: 'Specialized team for organic farming practices and certification processes.',
      equipment: ['Organic Fertilizers', 'Bio-pesticides', 'Certification Tools'],
      workingHours: '6 AM - 6 PM',
      emergencyAvailable: false
    }
  ];

  const jobs: Job[] = [
    {
      id: 'j1',
      title: 'Rice Harvesting Team Required',
      type: 'seasonal',
      description: 'Need experienced team for rice harvesting in 50-acre farm. Must have own equipment.',
      requirements: ['Experience in rice harvesting', 'Own harvesting equipment', 'Team of 6-8 people'],
      location: 'Punjab, India',
      payRate: '₹5000/day',
      deadline: '2024-01-15',
      postedBy: 'Farmer Singh',
      postedDate: '2024-01-01',
      applications: 12,
      status: 'active',
      priority: 'urgent',
      category: 'harvesting',
      duration: '15 days',
      benefits: ['Food provided', 'Accommodation', 'Bonus on completion']
    },
    {
      id: 'j2',
      title: 'Organic Farm Management',
      type: 'contract',
      description: 'Looking for organic farming specialists to manage 25-acre organic farm.',
      requirements: ['Organic farming certification', 'Minimum 5 years experience', 'Knowledge of bio-fertilizers'],
      location: 'Maharashtra, India',
      payRate: '₹3000/day',
      deadline: '2024-01-20',
      postedBy: 'Green Farms Ltd',
      postedDate: '2024-01-02',
      applications: 8,
      status: 'active',
      priority: 'high',
      category: 'planting',
      duration: '6 months',
      benefits: ['Health insurance', 'Performance bonus', 'Training provided']
    },
    {
      id: 'j3',
      title: 'Irrigation System Installation',
      type: 'temporary',
      description: 'Need skilled workers for drip irrigation system installation across 100 acres.',
      requirements: ['Irrigation system experience', 'Technical knowledge', 'Physical fitness'],
      location: 'Gujarat, India',
      payRate: '₹400/hour',
      deadline: '2024-01-25',
      postedBy: 'AgroTech Solutions',
      postedDate: '2024-01-03',
      applications: 15,
      status: 'active',
      priority: 'standard',
      category: 'irrigation',
      duration: '1 month',
      benefits: ['Skill development', 'Certificate', 'Travel allowance']
    }
  ];

  // Filtering and sorting logic
  const filteredWorkers = useMemo(() => {
    let filtered = workers.filter(worker => {
      const matchesCategory = selectedCategory === 'all' || worker.category === selectedCategory;
      const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           worker.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           worker.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !filterLocation || filterLocation === 'all' ||
                             worker.location.toLowerCase().includes(filterLocation.toLowerCase());
      const matchesExperience = !filterExperience || filterExperience === 'all' ||
                               checkExperienceMatch(worker.experience, filterExperience);
      const matchesAvailability = !filterAvailability || filterAvailability === 'all' ||
                                 worker.availability.toLowerCase().includes(filterAvailability.toLowerCase());

      return matchesCategory && matchesSearch && matchesLocation && matchesExperience && matchesAvailability;
    });

    // Sort workers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience);
        case 'rate':
          return parseInt(b.hourlyRate.replace('₹', '')) - parseInt(a.hourlyRate.replace('₹', ''));
        case 'availability':
          return a.availability === 'Available' ? -1 : 1;
        default:
          return 0;
      }
    });

    return filtered;
  }, [workers, selectedCategory, searchTerm, filterLocation, filterExperience, filterAvailability, sortBy]);

  const checkExperienceMatch = (experience: string, filter: string) => {
    const years = parseInt(experience);
    switch (filter) {
      case '0-2':
        return years >= 0 && years <= 2;
      case '3-5':
        return years >= 3 && years <= 5;
      case '6-10':
        return years >= 6 && years <= 10;
      case '10+':
        return years > 10;
      default:
        return true;
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredWorkers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWorkers = filteredWorkers.slice(startIndex, startIndex + itemsPerPage);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  // Handler functions
  const handleHireWorker = (worker: Worker) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`${t('worker-hired')}: ${worker.name}`);
    }, 1500);
  };

  const handleViewProfile = (worker: Worker) => {
    setSelectedWorker(worker);
    setShowWorkerModal(true);
  };

  const handleSendMessage = (worker: Worker) => {
    alert(`${t('message-sent')} ${worker.name}`);
  };

  const toggleFavorite = (workerId: string) => {
    setFavoriteWorkers(prev =>
      prev.includes(workerId)
        ? prev.filter(id => id !== workerId)
        : [...prev, workerId]
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        {/* Hero Section with Real-time Stats */}
        <motion.div 
          className="relative overflow-hidden bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative container mx-auto px-4 py-16">
            <motion.div 
              className="text-center mb-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
                variants={itemVariants}
              >
                {t('labor-management')}
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100"
                variants={itemVariants}
              >
                {t('labor-description')}
              </motion.p>

              {/* Feature Badges */}
              <motion.div
                className="flex flex-wrap justify-center gap-4 mb-8"
                variants={itemVariants}
              >
                {[
                  { key: 'skill-matching', icon: Target },
                  { key: 'real-time-availability', icon: Activity },
                  { key: 'verified-workers', icon: Shield },
                  { key: 'instant-hiring', icon: Zap },
                  { key: 'performance-tracking', icon: BarChart3 },
                  { key: 'smart-recommendations', icon: Sparkles }
                ].map(({ key, icon: Icon }) => (
                  <motion.div
                    key={key}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{t(key)}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Real-time Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                { label: 'worker-profiles', value: realTimeData.activeWorkers, icon: Users, color: 'from-blue-400 to-blue-600' },
                { label: 'real-time-availability', value: realTimeData.availableNow, icon: Activity, color: 'from-green-400 to-green-600' },
                { label: 'post-jobs', value: realTimeData.jobsPosted, icon: Briefcase, color: 'from-purple-400 to-purple-600' },
                { label: 'hiring-confirmed', value: realTimeData.successfulHires, icon: CheckCircle, color: 'from-orange-400 to-orange-600' }
              ].map(({ label, value, icon: Icon, color }) => (
                <motion.div
                  key={label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    <motion.span
                      key={value}
                      initial={{ scale: 1.2, color: '#fbbf24' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                      transition={{ duration: 0.3 }}
                    >
                      {value.toLocaleString()}
                    </motion.span>
                  </div>
                  <div className="text-sm text-blue-100">{t(label)}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="find-workers" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                {t('find-workers')}
              </TabsTrigger>
              <TabsTrigger value="hire-teams" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t('hire-teams')}
              </TabsTrigger>
              <TabsTrigger value="post-jobs" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t('post-jobs')}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                {t('worker-analytics')}
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                {t('job-marketplace')}
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {t('labor-insights')}
              </TabsTrigger>
            </TabsList>

            {/* Find Workers Tab */}
            <TabsContent value="find-workers">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Search and Filters */}
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder={t('search-workers')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2"
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        {t('filter-by-skills')}
                        {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>

                    <AnimatePresence>
                      {showFilters && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                            <Select value={filterLocation} onValueChange={setFilterLocation}>
                              <SelectTrigger>
                                <SelectValue placeholder={t('filter-by-location')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">{t('location')}</SelectItem>
                                <SelectItem value="punjab">Punjab</SelectItem>
                                <SelectItem value="haryana">Haryana</SelectItem>
                                <SelectItem value="gujarat">Gujarat</SelectItem>
                              </SelectContent>
                            </Select>

                            <Select value={filterExperience} onValueChange={setFilterExperience}>
                              <SelectTrigger>
                                <SelectValue placeholder={t('filter-by-experience')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">{t('experience')}</SelectItem>
                                <SelectItem value="0-2">0-2 {t('years-experience')}</SelectItem>
                                <SelectItem value="3-5">3-5 {t('years-experience')}</SelectItem>
                                <SelectItem value="6-10">6-10 {t('years-experience')}</SelectItem>
                                <SelectItem value="10+">10+ {t('years-experience')}</SelectItem>
                              </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                              <SelectTrigger>
                                <SelectValue placeholder={t('sort-by')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rating">{t('sort-by-rating')}</SelectItem>
                                <SelectItem value="experience">{t('sort-by-experience')}</SelectItem>
                                <SelectItem value="rate">{t('sort-by-rate')}</SelectItem>
                                <SelectItem value="availability">{t('sort-by-availability')}</SelectItem>
                              </SelectContent>
                            </Select>

                            <Button variant="outline" onClick={() => {
                              setFilterLocation('');
                              setFilterExperience('');
                              setFilterRate('');
                              setFilterAvailability('');
                            }}>
                              {t('clear-filters')}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>

                {/* Worker Categories */}
                <motion.div
                  className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 mb-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {workerCategories.map(({ id, nameKey, count, icon: Icon }) => (
                    <motion.div
                      key={id}
                      variants={itemVariants}
                      whileHover="hover"
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(id)}
                    >
                      <motion.div
                        className={`p-4 rounded-xl text-center transition-all duration-300 ${
                          selectedCategory === id
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                            : 'bg-white hover:bg-gray-50 border border-gray-200'
                        }`}
                        variants={cardHoverVariants}
                      >
                        <Icon className={`h-6 w-6 mx-auto mb-2 ${
                          selectedCategory === id ? 'text-white' : 'text-gray-600'
                        }`} />
                        <div className={`text-sm font-medium mb-1 ${
                          selectedCategory === id ? 'text-white' : 'text-gray-900'
                        }`}>
                          {t(nameKey)}
                        </div>
                        <div className={`text-xs ${
                          selectedCategory === id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {count}
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Workers Grid */}
                {filteredWorkers.length > 0 ? (
                  <>
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {paginatedWorkers.map((worker) => (
                    <motion.div
                      key={worker.id}
                      variants={itemVariants}
                      whileHover="hover"
                      className="cursor-pointer"
                    >
                      <motion.div
                        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                        variants={cardHoverVariants}
                      >
                        <div className="relative">
                          <img
                            src={worker.image}
                            alt={worker.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-4 left-4 flex gap-2">
                            {worker.verified && (
                              <Badge className="bg-green-500 text-white">
                                <Shield className="h-3 w-3 mr-1" />
                                {t('verified-badge')}
                              </Badge>
                            )}
                            {worker.premium && (
                              <Badge className="bg-purple-500 text-white">
                                <Award className="h-3 w-3 mr-1" />
                                {t('premium-worker')}
                              </Badge>
                            )}
                          </div>
                          <div className="absolute top-4 right-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="bg-white/80 backdrop-blur-sm hover:bg-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFavoriteWorkers(prev =>
                                  prev.includes(worker.id)
                                    ? prev.filter(id => id !== worker.id)
                                    : [...prev, worker.id]
                                );
                              }}
                            >
                              <Heart className={`h-4 w-4 ${
                                favoriteWorkers.includes(worker.id)
                                  ? 'fill-red-500 text-red-500'
                                  : 'text-gray-600'
                              }`} />
                            </Button>
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <Badge className={`${
                              worker.availability === 'Available'
                                ? 'bg-green-500'
                                : 'bg-orange-500'
                            } text-white`}>
                              <Activity className="h-3 w-3 mr-1" />
                              {worker.availability}
                            </Badge>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {worker.name}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <MapPin className="h-4 w-4" />
                                {worker.location}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium">{worker.rating}</span>
                                </div>
                                <span className="text-sm text-gray-500">
                                  ({worker.reviews} {t('rating')})
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
                                {worker.hourlyRate}
                              </div>
                              <div className="text-sm text-gray-500">
                                {t('hourly-rate')}
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1">
                              {worker.skills.slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {worker.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{worker.skills.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div>
                              <span className="text-gray-500">{t('experience')}:</span>
                              <div className="font-medium">{worker.experience}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">{t('response-time')}:</span>
                              <div className="font-medium">{worker.responseTime}</div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="flex-1"
                              size="sm"
                              onClick={() => handleHireWorker(worker)}
                              disabled={isLoading}
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              {isLoading ? t('hiring-confirmed') : t('hire-now')}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProfile(worker)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendMessage(worker)}
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    className="flex justify-center items-center gap-4 mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {t('previous')}
                    </Button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-10 h-10"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      {t('next')}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </motion.div>
                )}
                </>
                ) : (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t('no-workers-found')}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {t('try-different-filters')}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                        setFilterLocation('');
                        setFilterExperience('');
                        setFilterAvailability('');
                        setCurrentPage(1);
                      }}
                    >
                      {t('clear-filters')}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>

            {/* Hire Teams Tab */}
            <TabsContent value="hire-teams">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('specialized-teams')}</h2>
                  <p className="text-gray-600">{t('team-management')}</p>
                </div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {teams.map((team) => (
                    <motion.div
                      key={team.id}
                      variants={itemVariants}
                      whileHover="hover"
                      className="cursor-pointer"
                    >
                      <motion.div
                        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                        variants={cardHoverVariants}
                      >
                        <div className="relative">
                          <img
                            src={team.image}
                            alt={team.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            {team.verified && (
                              <Badge className="bg-green-500 text-white">
                                <Shield className="h-3 w-3 mr-1" />
                                {t('verified-badge')}
                              </Badge>
                            )}
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <Badge className={`${
                              team.availability === 'Available'
                                ? 'bg-green-500'
                                : 'bg-orange-500'
                            } text-white`}>
                              <Activity className="h-3 w-3 mr-1" />
                              {team.availability}
                            </Badge>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {team.name}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <Users className="h-4 w-4" />
                                {team.teamSize} {t('team-size')}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <MapPin className="h-4 w-4" />
                                {team.location}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium">{team.rating}</span>
                                </div>
                                <span className="text-sm text-gray-500">
                                  ({team.reviews} {t('reviews')})
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
                                {team.dailyRate}
                              </div>
                              <div className="text-sm text-gray-500">
                                {t('daily-rate')}
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <Badge variant="secondary" className="text-xs">
                              {team.specialization}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div>
                              <span className="text-gray-500">{t('team-leader')}:</span>
                              <div className="font-medium">{team.teamLeader}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">{t('success-rate')}:</span>
                              <div className="font-medium">{team.successRate}%</div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="flex-1"
                              size="sm"
                              onClick={() => alert(`${t('team-hired')}: ${team.name}`)}
                            >
                              <Users className="h-4 w-4 mr-2" />
                              {t('hire-team')}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Post Jobs Tab */}
            <TabsContent value="post-jobs">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      {t('post-job')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Briefcase className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {t('post-jobs')}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {t('job-marketplace')}
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        {t('post-job')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'total-applications', value: '1,247', icon: FileText, color: 'from-blue-400 to-blue-600' },
                    { label: 'pending-applications', value: '89', icon: Clock, color: 'from-orange-400 to-orange-600' },
                    { label: 'approved-applications', value: '156', icon: CheckCircle, color: 'from-green-400 to-green-600' },
                    { label: 'success-rate', value: '94%', icon: TrendingUp, color: 'from-purple-400 to-purple-600' }
                  ].map(({ label, value, icon: Icon, color }) => (
                    <motion.div
                      key={label}
                      className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
                      <div className="text-sm text-gray-600">{t(label)}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Marketplace Tab */}
            <TabsContent value="marketplace">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('job-marketplace')}</h2>
                  <p className="text-gray-600">{t('active-jobs')}</p>
                </div>

                <motion.div
                  className="space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {jobs.map((job) => (
                    <motion.div
                      key={job.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {job.title}
                            </h3>
                            <Badge className={`${
                              job.priority === 'urgent' ? 'bg-red-500' :
                              job.priority === 'high' ? 'bg-amber-500' :
                              job.priority === 'standard' ? 'bg-blue-500' : 'bg-gray-500'
                            } text-white`}>
                              {t(job.priority)}
                            </Badge>
                            <Badge variant="outline">
                              {t(job.type)}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {job.payRate}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {job.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {job.deadline}
                            </div>
                          </div>

                          <p className="text-gray-700 mb-3">{job.description}</p>

                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">{t('job-requirements')}:</h4>
                            <div className="flex flex-wrap gap-2">
                              {job.requirements.map((req, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Benefits:</h4>
                            <div className="flex flex-wrap gap-2">
                              {job.benefits.map((benefit, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              <span>{t('posted-by')}: {job.postedBy}</span>
                              <span className="mx-2">•</span>
                              <span>{job.applications} {t('total-applications')}</span>
                            </div>

                            <div className="flex gap-2">
                              <Button size="sm">
                                <Send className="h-4 w-4 mr-2" />
                                Apply Now
                              </Button>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      {t('labor-insights')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {t('labor-insights')}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {t('worker-analytics')}
                      </p>
                      <Button>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        {t('view-all')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Worker Profile Modal */}
        <Dialog open={showWorkerModal} onOpenChange={setShowWorkerModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {selectedWorker && (
                  <>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedWorker.image} alt={selectedWorker.name} />
                      <AvatarFallback>{selectedWorker.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-bold">{selectedWorker.name}</h2>
                      <p className="text-sm text-gray-600">{selectedWorker.location}</p>
                    </div>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            {selectedWorker && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t('worker-details')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">{t('rating')}:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{selectedWorker.rating}</span>
                          <span className="text-sm text-gray-500">({selectedWorker.reviews})</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">{t('experience')}:</span>
                        <span className="font-medium">{selectedWorker.experience}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">{t('hourly-rate')}:</span>
                        <span className="font-medium text-green-600">{selectedWorker.hourlyRate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">{t('daily-rate')}:</span>
                        <span className="font-medium text-green-600">{selectedWorker.dailyRate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">{t('availability')}:</span>
                        <Badge className={selectedWorker.availability === 'Available' ? 'bg-green-500' : 'bg-orange-500'}>
                          {selectedWorker.availability}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">{t('response-time')}:</span>
                        <span className="font-medium">{selectedWorker.responseTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">{t('success-rate')}:</span>
                        <span className="font-medium">{selectedWorker.successRate}%</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t('contact-info')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{selectedWorker.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{selectedWorker.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{selectedWorker.location}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{selectedWorker.workingHours}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span>{selectedWorker.languages.join(', ')}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Skills and Specializations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('skills')} & {t('specialization')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">{t('skills')}:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedWorker.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">{t('specialization')}:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedWorker.specializations.map((spec, index) => (
                            <Badge key={index} variant="outline">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Certifications:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedWorker.certifications.map((cert, index) => (
                            <Badge key={index} className="bg-blue-500 text-white">
                              <Award className="h-3 w-3 mr-1" />
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{selectedWorker.description}</p>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      handleHireWorker(selectedWorker);
                      setShowWorkerModal(false);
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t('hire-now')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSendMessage(selectedWorker)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t('send-message')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      toggleFavorite(selectedWorker.id);
                    }}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${
                      favoriteWorkers.includes(selectedWorker.id)
                        ? 'fill-red-500 text-red-500'
                        : ''
                    }`} />
                    {favoriteWorkers.includes(selectedWorker.id) ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Labour;
