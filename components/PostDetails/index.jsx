"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const PostDetails = ({ id }) => {
  const router = useRouter();

  const fetchPostData = async () => {
    const response = await axiosInstance.get(`/posts/${id}`);
    return response.data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["postData"],
    queryFn: fetchPostData,
    staleTime: 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    router.push("/");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Card className="p-4">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={data?.title} disabled />
          </div>
          <div>
            <Label htmlFor="body">Body</Label>
            <Input id="body" value={data?.body} disabled />
          </div>
          <div>
            <Button type="submit">Go Home</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostDetails;
