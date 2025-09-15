import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Heading from '../../components/ui/Heading';
import Loading from '../../components/ui/Loading';
import NoData from '../../components/ui/NoData';
import { profileService } from '../../services/profileService';
import { timetableService } from '../../services/timetableService';

const Timetable = () => {
  const [timetable, setTimetable] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getTimetable = async () => {
    setIsLoading(true);
    try {
      const profileRes = await profileService.getProfile();
      const branchId = profileRes.data?.data?.branch?._id;

      if (branchId) {
        const timetableRes =
          await timetableService.getTimetableByBranch(branchId);
        // Assuming one branch has only one timetable for simplicity
        setTimetable(timetableRes.data?.data[0] || null);
      } else {
        toast.error('Branch information not found in your profile.');
      }
    } catch (error) {
      toast.error('Failed to fetch timetable.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTimetable();
  }, []);

  return (
    <div>
      <Heading title="My Timetable" />
      {isLoading ? (
        <Loading />
      ) : !timetable ? (
        <NoData message="Timetable has not been uploaded for your branch yet." />
      ) : (
        <div className="mt-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">
              Timetable for {timetable.branch?.name}
            </h3>
            <div className="mt-4">
              <iframe
                src={timetable.file.url}
                title="Timetable"
                className="w-full h-screen border rounded-md"
              >
                Your browser does not support PDFs. Please download the file to
                view it:
                <a href={timetable.file.url}>Download PDF</a>
              </iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
