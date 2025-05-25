
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const courseFormSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อหลักสูตร"),
  type: z.enum(["public", "private"], {
    required_error: "กรุณาเลือกประเภทการอบรม",
  }),
  company: z.string().optional(),
  instructor: z.string().optional(),
  location: z.string().min(1, "กรุณากรอกสถานที่จัดอบรม"),
  duration: z.string().min(1, "กรุณากรอกระยะเวลาอบรม"),
  capacity: z.number().optional(),
  description: z.string().optional(),
  dates: z.array(z.date()).min(1, "กรุณาเลือกวันที่อบรมอย่างน้อย 1 วัน"),
});

type CourseFormData = z.infer<typeof courseFormSchema>;

interface CreateCourseFormProps {
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
}

const CreateCourseForm = ({ onSubmit, onCancel }: CreateCourseFormProps) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: "",
      type: "public",
      company: "",
      instructor: "",
      location: "",
      duration: "",
      description: "",
      dates: [],
    },
  });

  const courseType = form.watch("type");

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const isAlreadySelected = selectedDates.some(
      (selectedDate) => selectedDate.toDateString() === date.toDateString()
    );

    if (isAlreadySelected) {
      const newDates = selectedDates.filter(
        (selectedDate) => selectedDate.toDateString() !== date.toDateString()
      );
      setSelectedDates(newDates);
      form.setValue("dates", newDates);
    } else {
      const newDates = [...selectedDates, date].sort((a, b) => a.getTime() - b.getTime());
      setSelectedDates(newDates);
      form.setValue("dates", newDates);
    }
  };

  const removeDateSelection = (dateToRemove: Date) => {
    const newDates = selectedDates.filter(
      (date) => date.toDateString() !== dateToRemove.toDateString()
    );
    setSelectedDates(newDates);
    form.setValue("dates", newDates);
  };

  const handleSubmit = (data: CourseFormData) => {
    // ตรวจสอบข้อมูลจำเป็นสำหรับงาน Private
    if (data.type === "private" && !data.company) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "การอบรมแบบ Private ต้องระบุบริษัท",
        variant: "destructive",
      });
      return;
    }

    onSubmit(data);
    toast({
      title: "สร้างหลักสูตรสำเร็จ",
      description: `หลักสูตร "${data.name}" ถูกสร้างเรียบร้อยแล้ว`,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-center">สร้างหลักสูตรอบรมใหม่</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* ชื่อหลักสูตร */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อหลักสูตร *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="เช่น การพัฒนาทักษะการสื่อสาร"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ประเภทการอบรม */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ประเภทการอบรม *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกประเภทการอบรม" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="public">Public (เปิดสาธารณะ)</SelectItem>
                      <SelectItem value="private">Private (เฉพาะบริษัท)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* บริษัท - แสดงเฉพาะงาน Private */}
            {courseType === "private" && (
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>บริษัท *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ชื่อบริษัทผู้จัดอบรม"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* วิทยากร */}
            <FormField
              control={form.control}
              name="instructor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    วิทยากร {courseType === "public" && "(กรอกภายหลังได้)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ชื่อวิทยากรผู้สอน"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* สถานที่ */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>สถานที่จัดอบรม *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="เช่น ห้องประชุมใหญ่ อาคาร A"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ระยะเวลา */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ระยะเวลาอบรม *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="เช่น 6 ชั่วโมง หรือ 2 วัน"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* จำนวนผู้เข้าร่วม */}
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>จำนวนผู้เข้าร่วมสูงสุด (กรอกภายหลังได้)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="เช่น 30"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* วันที่อบรม */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">วันที่อบรม *</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      selectedDates.length === 0 && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDates.length === 0
                      ? "เลือกวันที่อบรม (คลิกเพื่อเลือกได้หลายวัน)"
                      : `เลือกแล้ว ${selectedDates.length} วัน`}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={undefined}
                    onSelect={handleDateSelect}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>

              {/* แสดงวันที่ที่เลือก */}
              {selectedDates.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">วันที่เลือกแล้ว:</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedDates.map((date, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm"
                      >
                        <span>{format(date, "d/M/yyyy")}</span>
                        <button
                          type="button"
                          onClick={() => removeDateSelection(date)}
                          className="hover:bg-blue-100 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* รายละเอียด */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>รายละเอียดเพิ่มเติม</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="อธิบายเพิ่มเติมเกี่ยวกับหลักสูตร"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ปุ่มดำเนินการ */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                ยกเลิก
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                สร้างหลักสูตร
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateCourseForm;
