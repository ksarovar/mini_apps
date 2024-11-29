"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="container py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
            Get in Touch
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Have a project in mind? Let's discuss how we can work together.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send me a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Input placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <Input type="email" placeholder="Your Email" />
              </div>
              <div className="space-y-2">
                <Textarea placeholder="Your Message" className="min-h-[150px]" />
              </div>
              <Button className="w-full">
                Send Message
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="flex items-center space-x-4 p-6">
              <Mail className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-sm text-gray-500">contact@example.com</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center space-x-4 p-6">
              <MessageSquare className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Social Media</h3>
                <p className="text-sm text-gray-500">@blockchaindev</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}