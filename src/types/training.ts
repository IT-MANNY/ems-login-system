
export interface Team {
  id: string;
  name: string;
  members: number;
}

export interface Course {
  id: string;
  name: string;
  type: string;
  date: string;
  capacity: number;
  registered: number;
  duration: string;
  location: string;
}

export interface TeamAssignment {
  id: string;
  teamId: string;
  courseId: string;
  date: string;
}
