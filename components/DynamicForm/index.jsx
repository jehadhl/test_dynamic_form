"use client";
import React from "react";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { formSchema } from "@/lib/validation";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useDynamicForm } from "@/hooks/useDynamicForm";

const DynamicForm = ({ formData }) => {
  const router = useRouter();
  const {
    form,
    fieldInteractions,
    showPreferredContact,
    handleSubmit,
    handleReset,
    onSubmit,
    mutation,
  } = useDynamicForm(formData, formSchema, router);

  return (
    <Card className="w-[450px] mt-8">
      <CardHeader>
        <CardTitle>Create Dynamic form</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {formData.map((field) => (
              <FormItem key={field.name}>
                <FormControl>
                  {/* Input */}
                  {field.variant === "Input" ? (
                    <div className="flex flex-col gap-2">
                      <FormLabel>{field.label}</FormLabel>
                      <Input
                        type={field.type.toLowerCase()}
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        {...form.register(field.name, {
                          valueAsNumber: field.type === "Number",
                        })}
                      />
                      <div className="text-sm text-gray-500">
                        {fieldInteractions[field.name]
                          ? `Interactions: ${fieldInteractions[field.name]}`
                          : ""}
                      </div>
                    </div>
                  ) : field.variant === "Checkbox" ? (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        {...form.register(field.name)}
                        onCheckedChange={(val) =>
                          form.setValue(field.name, val)
                        }
                        disabled={field.disabled}
                      />
                      <FormLabel>{field.label}</FormLabel>
                    </div>
                  ) : null}
                </FormControl>
                {form.formState.errors[field.name] && (
                  <FormMessage>
                    {form.formState.errors[field.name]?.message}
                  </FormMessage>
                )}
              </FormItem>
            ))}

            {showPreferredContact && (
              <FormField
                control={form.control}
                name="contact_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Contact Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-gray-500">
                      {fieldInteractions[field.name]
                        ? `Interactions: ${fieldInteractions[field.name]}`
                        : ""}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-between items-center">
              <Button variant={"outline"} type="button" onClick={handleReset}>
                Reset
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DynamicForm;
