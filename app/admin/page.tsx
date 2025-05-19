"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Search,
  Plus,
  MoreHorizontal,
  Download,
  Users,
  BarChart,
  Settings,
  LogOut,
  Eye,
  Edit,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("templates")

  const templates = [
    {
      id: 1,
      name: "E-commerce Product Promotion",
      category: "电商零售",
      status: "published",
      downloads: 1245,
      lastUpdated: "2025-05-10",
    },
    {
      id: 2,
      name: "Online Course Advertisement",
      category: "教育培训",
      status: "published",
      downloads: 892,
      lastUpdated: "2025-05-09",
    },
    {
      id: 3,
      name: "Restaurant Menu Special",
      category: "餐饮服务",
      status: "draft",
      downloads: 0,
      lastUpdated: "2025-05-08",
    },
    {
      id: 4,
      name: "Tech Conference Invitation",
      category: "科技互联网",
      status: "published",
      downloads: 1578,
      lastUpdated: "2025-05-07",
    },
    {
      id: 5,
      name: "Fashion Sale Announcement",
      category: "电商零售",
      status: "published",
      downloads: 1102,
      lastUpdated: "2025-05-06",
    },
  ]

  const users = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "Admin",
      status: "active",
      lastActive: "2025-05-15",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Sarah Chen",
      email: "sarah@example.com",
      role: "Designer",
      status: "active",
      lastActive: "2025-05-14",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      email: "michael@example.com",
      role: "Designer",
      status: "inactive",
      lastActive: "2025-05-01",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma@example.com",
      role: "Viewer",
      status: "active",
      lastActive: "2025-05-13",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "David Kim",
      email: "david@example.com",
      role: "Designer",
      status: "active",
      lastActive: "2025-05-12",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const stats = [
    {
      title: "Total Users",
      value: "2,543",
      change: "+12.5%",
      trend: "up",
    },
    {
      title: "Active Templates",
      value: "187",
      change: "+7.2%",
      trend: "up",
    },
    {
      title: "Downloads",
      value: "24.8k",
      change: "+18.3%",
      trend: "up",
    },
    {
      title: "Avg. Session",
      value: "12m 24s",
      change: "-2.1%",
      trend: "down",
    },
  ]

  const popularTemplates = [
    { name: "E-commerce Product Promotion", downloads: 1245 },
    { name: "Tech Conference Invitation", downloads: 1578 },
    { name: "Fashion Sale Announcement", downloads: 1102 },
    { name: "Online Course Advertisement", downloads: 892 },
    { name: "Corporate Business Card", downloads: 756 },
  ]

  const userActivity = [
    { date: "May 15", users: 320 },
    { date: "May 14", users: 280 },
    { date: "May 13", users: 310 },
    { date: "May 12", users: 340 },
    { date: "May 11", users: 290 },
    { date: "May 10", users: 250 },
    { date: "May 9", users: 270 },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r bg-background">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl">DesignFlow</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            <Link
              href="/admin"
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                activeTab === "dashboard" ? "bg-muted" : "hover:bg-muted"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin"
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                activeTab === "templates" ? "bg-muted" : "hover:bg-muted"
              }`}
              onClick={() => setActiveTab("templates")}
            >
              <Settings className="h-4 w-4" />
              Template Management
            </Link>
            <Link
              href="/admin"
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                activeTab === "users" ? "bg-muted" : "hover:bg-muted"
              }`}
              onClick={() => setActiveTab("users")}
            >
              <Users className="h-4 w-4" />
              User Analysis
            </Link>
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin User</span>
              <span className="text-xs text-muted-foreground">admin@designflow.com</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "templates" && "Template Management"}
              {activeTab === "users" && "User Analysis"}
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className={`text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                        {stat.change} from last month
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>User Activity</CardTitle>
                    <CardDescription>Daily active users over the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-end gap-2">
                      {userActivity.map((day, i) => (
                        <div key={i} className="relative flex flex-1 flex-col items-center">
                          <div
                            className="w-full bg-primary/10 rounded-t-sm"
                            style={{ height: `${(day.users / 340) * 150}px` }}
                          ></div>
                          <span className="mt-2 text-xs text-muted-foreground">{day.date}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Popular Templates</CardTitle>
                    <CardDescription>Most downloaded templates this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {popularTemplates.map((template, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm">{template.name}</span>
                          <span className="text-sm font-medium">{template.downloads}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search templates..." className="pl-8 w-full" />
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Template
                  </Button>
                </div>
              </div>

              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>{template.category}</TableCell>
                        <TableCell>
                          <Badge variant={template.status === "published" ? "default" : "outline"}>
                            {template.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{template.downloads}</TableCell>
                        <TableCell>{template.lastUpdated}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search users..." className="pl-8 w-full" />
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>

              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "default" : "outline"}>{user.status}</Badge>
                        </TableCell>
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Export Data
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
