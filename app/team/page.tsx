"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  MoreHorizontal,
  MessageSquare,
  Clock,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  Users,
  UserPlus,
  Settings,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ProjectStatus = "completed" | "in-progress" | "not-started";

interface TeamMember {
  name: string;
  avatar: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  dueDate: string;
  members: TeamMember[];
  progress: number;
}

interface Task {
  id: number;
  title: string;
  project: string;
  status: ProjectStatus;
  dueDate: string;
  assignee: TeamMember;
}

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState("projects")

  const projects: Project[] = [
    {
      id: 1,
      name: "Summer Campaign 2025",
      description: "Marketing materials for the upcoming summer promotion",
      status: "in-progress",
      dueDate: "2025-06-15",
      members: [
        { name: "Alex Johnson", avatar: "/placeholder.svg?height=40&width=40" },
        { name: "Sarah Chen", avatar: "/placeholder.svg?height=40&width=40" },
        { name: "Michael Rodriguez", avatar: "/placeholder.svg?height=40&width=40" },
      ],
      progress: 65,
    },
    {
      id: 2,
      name: "Website Redesign",
      description: "Complete overhaul of the company website",
      status: "in-progress",
      dueDate: "2025-07-30",
      members: [
        { name: "Emma Wilson", avatar: "/placeholder.svg?height=40&width=40" },
        { name: "David Kim", avatar: "/placeholder.svg?height=40&width=40" },
      ],
      progress: 40,
    },
    {
      id: 3,
      name: "Product Launch Materials",
      description: "Design assets for the new product line",
      status: "completed",
      dueDate: "2025-05-01",
      members: [
        { name: "Alex Johnson", avatar: "/placeholder.svg?height=40&width=40" },
        { name: "Sarah Chen", avatar: "/placeholder.svg?height=40&width=40" },
      ],
      progress: 100,
    },
    {
      id: 4,
      name: "Social Media Templates",
      description: "Standard templates for various social platforms",
      status: "not-started",
      dueDate: "2025-08-15",
      members: [{ name: "Michael Rodriguez", avatar: "/placeholder.svg?height=40&width=40" }],
      progress: 0,
    },
  ]

  const tasks: Task[] = [
    {
      id: 1,
      title: "Create hero banner for summer campaign",
      project: "Summer Campaign 2025",
      status: "in-progress",
      dueDate: "2025-05-25",
      assignee: { name: "Sarah Chen", avatar: "/placeholder.svg?height=40&width=40" },
    },
    {
      id: 2,
      title: "Design product page mockups",
      project: "Website Redesign",
      status: "not-started",
      dueDate: "2025-06-10",
      assignee: { name: "Emma Wilson", avatar: "/placeholder.svg?height=40&width=40" },
    },
    {
      id: 3,
      title: "Create social media graphics",
      project: "Summer Campaign 2025",
      status: "completed",
      dueDate: "2025-05-15",
      assignee: { name: "Michael Rodriguez", avatar: "/placeholder.svg?height=40&width=40" },
    },
    {
      id: 4,
      title: "Design email newsletter template",
      project: "Product Launch Materials",
      status: "completed",
      dueDate: "2025-04-30",
      assignee: { name: "Alex Johnson", avatar: "/placeholder.svg?height=40&width=40" },
    },
    {
      id: 5,
      title: "Create Instagram story templates",
      project: "Social Media Templates",
      status: "not-started",
      dueDate: "2025-08-20",
      assignee: { name: "Michael Rodriguez", avatar: "/placeholder.svg?height=40&width=40" },
    },
  ]

  const team = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Creative Director",
      email: "alex@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      projects: 8,
      tasks: 3,
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Senior Designer",
      email: "sarah@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      projects: 5,
      tasks: 7,
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      role: "Graphic Designer",
      email: "michael@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      projects: 4,
      tasks: 5,
    },
    {
      id: 4,
      name: "Emma Wilson",
      role: "UI/UX Designer",
      email: "emma@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      projects: 3,
      tasks: 4,
    },
    {
      id: 5,
      name: "David Kim",
      role: "Marketing Designer",
      email: "david@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      projects: 6,
      tasks: 2,
    },
  ]

  const getStatusColor = (status: ProjectStatus): string => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "not-started":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>
      case "not-started":
        return <Badge variant="outline">Not Started</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <span className="text-xl font-bold">DesignFlow</span>
          </Link>
          <nav className="flex items-center gap-6 flex-1">
            <Link href="/templates" className="text-sm font-medium hover:text-primary">
              Templates
            </Link>
            <Link href="/editor" className="text-sm font-medium hover:text-primary">
              Editor
            </Link>
            <Link href="/assets" className="text-sm font-medium hover:text-primary">
              Assets
            </Link>
            <Link href="/team" className="text-sm font-medium text-primary">
              Team
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </header>
      <main className="flex-1 py-6">
        <div className="container">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">Team Collaboration</h1>
              <p className="text-muted-foreground">
                Work together seamlessly with real-time collaboration and feedback tools
              </p>
            </div>

            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                </TabsList>

                <div className="flex gap-2">
                  {activeTab === "projects" && (
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Project
                    </Button>
                  )}
                  {activeTab === "tasks" && (
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Task
                    </Button>
                  )}
                  {activeTab === "team" && (
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite Member
                    </Button>
                  )}
                </div>
              </div>

              {/* Projects Tab */}
              <TabsContent value="projects" className="mt-0">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project) => (
                    <Card key={project.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{project.name}</CardTitle>
                            <CardDescription className="mt-1">{project.description}</CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Edit Project
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Members
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Archive Project</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Due: {project.dueDate}</span>
                          </div>
                          <div className={`h-2 w-2 rounded-full ${getStatusColor(project.status)}`}></div>
                          <span className="text-sm text-muted-foreground capitalize">
                            {project.status.replace("-", " ")}
                          </span>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Progress</span>
                            <span className="text-sm font-medium">{project.progress}%</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${project.progress}%` }}></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {project.members.map((member, i) => (
                              <Avatar key={i} className="border-2 border-background h-8 w-8">
                                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ))}
                            {project.members.length > 3 && (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                                +{project.members.length - 3}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center h-full py-8">
                      <div className="rounded-full bg-primary/10 p-3 mb-3">
                        <Plus className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium mb-1">Create New Project</h3>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        Start a new design project with your team
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="mt-0">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search tasks..." className="pl-8 w-full" />
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="not-started">Not Started</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Projects</SelectItem>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  {tasks.map((task) => (
                    <Card key={task.id}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {task.status === "completed" ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                          ) : task.status === "in-progress" ? (
                            <Clock className="h-6 w-6 text-blue-500" />
                          ) : (
                            <XCircle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                          >
                            {task.title}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            <span className="text-sm text-muted-foreground">{task.project}</span>
                            <span className="text-sm text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {task.dueDate}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                            <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                          </Avatar>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit Task</DropdownMenuItem>
                              <DropdownMenuItem>Change Assignee</DropdownMenuItem>
                              {task.status !== "completed" ? (
                                <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>Mark as Incomplete</DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete Task</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Team Tab */}
              <TabsContent value="team" className="mt-0">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {team.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                          <Avatar className="h-20 w-20 mb-4">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="font-medium text-lg">{member.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{member.role}</p>

                          <div className="flex gap-3 mb-4">
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            <Button variant="outline" size="sm">
                              <Users className="h-4 w-4 mr-1" />
                              Profile
                            </Button>
                          </div>

                          <Separator className="mb-4" />

                          <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="text-center">
                              <p className="text-2xl font-bold">{member.projects}</p>
                              <p className="text-sm text-muted-foreground">Projects</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold">{member.tasks}</p>
                              <p className="text-sm text-muted-foreground">Tasks</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center h-full py-8">
                      <div className="rounded-full bg-primary/10 p-3 mb-3">
                        <UserPlus className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium mb-1">Invite Team Member</h3>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        Add new members to collaborate on projects
                      </p>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Member
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2025 DesignFlow. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
