import { MessageSquare, FileText, CheckCircle, Folder } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function RecentActivities() {
  const [data, setData] = useState(null);
  const [activities, setActivities] = useState([]);

  const params = useParams();
  const departmentId = params.id;

  useEffect(() => {
    const fetchAccreditation = async () => {
      try {
        const res = await axios.get(
          `http://localhost:1234/api/accreditation/getAccreditation/${departmentId}`
        );
        setData(res.data);

        // Distribute into 15 activities
        const mappedActivities = [
          // Faculty Members Updated
          {
            id: 1,
            type: "Full-time Faculty",
            user: "Nikolai",
            action: `Full-time Faculty: ${res.data.fulltimeFaculty}`,
            icon: MessageSquare,
            color: "yellow",
          },
          {
            id: 2,
            type: "Visiting Faculty",
            user: "Nikolai",
            action: `Visiting Faculty: ${res.data.visitingFaculty}`,
            icon: FileText,
            color: "green",
          },
          {
            id: 3,
            type: "Total Faculty",
            user: "Nikolai",
            action: `Total Faculty: ${res.data.facultyMembers}`,
            icon: CheckCircle,
            color: "red",
          },
          {
            id: 4,
            type: "PhD Instructors",
            user: "Nikolai",
            action: `PhD Instructors: ${res.data.PhDInstructors.join(", ")}`,
            icon: Folder,
            color: "purple",
          },

          // Alternating colors and icons for next activities
          {
            id: 5,
            type: "Industry Practitioner",
            user: "Nikolai",
            action: `Industry Practitioner: ${res.data.industryPractitioner.join(
              ", "
            )}`,
            icon: MessageSquare,
            color: "yellow",
          },
          {
            id: 6,
            type: "Programming Lab",
            user: "Basel",
            action: `Programming Lab: ${
              res.data.programmingLab ? "Yes" : "No"
            }`,
            icon: FileText,
            color: "green",
          },
          {
            id: 7,
            type: "Systems Lab",
            user: "Basel",
            action: `Systems Lab: ${res.data.systemsLab ? "Yes" : "No"}`,
            icon: CheckCircle,
            color: "red",
          },
          {
            id: 8,
            type: "Hardware Lab",
            user: "Basel",
            action: `Hardware Lab: ${res.data.hardwareLab ? "Yes" : "No"}`,
            icon: Folder,
            color: "purple",
          },

          // Continuing with alternating colors and icons
          {
            id: 9,
            type: "Number of Systems",
            user: "Basel",
            action: `Number of Systems: ${res.data.numberOfSystems}`,
            icon: MessageSquare,
            color: "yellow",
          },
          {
            id: 10,
            type: "Number of Stations",
            user: "Basel",
            action: `Number of Stations: ${res.data.numberOfStations}`,
            icon: FileText,
            color: "green",
          },
          {
            id: 11,
            type: "Computing Books",
            user: "Jenathon",
            action: `Computing Books: ${res.data.totalNumberOfComputingBooks}`,
            icon: CheckCircle,
            color: "red",
          },
          {
            id: 12,
            type: "IEEE ACM Copies",
            user: "Jenathon",
            action: `IEEE ACM Copies: ${res.data.ieeeAcmCopies}`,
            icon: Folder,
            color: "purple",
          },

          // Further alternation for remaining activities
          {
            id: 13,
            type: "Tech Magazines",
            user: "Jenathon",
            action: `Tech Magazines: ${res.data.techMagazines}`,
            icon: MessageSquare,
            color: "yellow",
          },
          {
            id: 14,
            type: "Transport",
            user: "Jenathon",
            action: `Transport: ${res.data.transport ? "Yes" : "No"}`,
            icon: FileText,
            color: "green",
          },
          {
            id: 15,
            type: "Hostels and Sports Facilities",
            user: "Jenathon",
            action: `Hostels: ${
              res.data.hostels ? "Yes" : "No"
            } and Sports Facilities: ${
              res.data.sportsFacilities ? "Yes" : "No"
            }`,
            icon: CheckCircle,
            color: "red",
          },
        ];

        setActivities(mappedActivities);
      } catch (err) {
        console.error("Error fetching accreditation data:", err);
      }
    };

    if (departmentId) {
      fetchAccreditation();
    }
  }, [departmentId]);

  return (
    <div className="bg-gray-50 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6">Recent Activities</h2>
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            <div className={`bg-${activity.color}-100 p-3 rounded-full`}>
              <activity.icon className={`text-${activity.color}-500 w-5 h-5`} />
            </div>
            <div>
              <h3 className="font-semibold">{activity.type}</h3>
              <p className="text-gray-500">{activity.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivities;
