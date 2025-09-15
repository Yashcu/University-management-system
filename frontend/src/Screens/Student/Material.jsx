import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Heading from '../../components/ui/Heading';
import Loading from '../../components/ui/Loading';
import NoData from '../../components/ui/NoData';
import { subjectService } from '../../services/subjectService';
import { materialService } from '../../services/materialService';
import { profileService } from '../../services/profileService';

const Material = () => {
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [studentBranch, setStudentBranch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getStudentProfileAndSubjects = async () => {
    setIsLoading(true);
    try {
      const profileRes = await profileService.getProfile();
      const branchId = profileRes.data?.data?.branch?._id;
      setStudentBranch(branchId);

      if (branchId) {
        const subjectRes = await subjectService.getAllSubjects({
          branch: branchId,
        });
        setSubjects(subjectRes.data?.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch profile and subjects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStudentProfileAndSubjects();
  }, []);

  const getMaterials = async () => {
    if (!selectedSubject) return;
    setIsLoading(true);
    try {
      const { data } =
        await materialService.getMaterialsBySubject(selectedSubject);
      setMaterials(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch materials');
      setMaterials([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMaterials();
  }, [selectedSubject]);

  return (
    <div>
      <Heading title="Study Material" />

      <div className="mt-6">
        <label className="block text-sm font-medium">
          Select Subject to View Materials
        </label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-md"
        >
          <option value="">Select Subject</option>
          {subjects.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <Loading />
      ) : !selectedSubject ? (
        <p className="text-center mt-8 text-gray-500">
          Please select a subject to see materials.
        </p>
      ) : materials.length === 0 ? (
        <NoData />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {materials.map((material) => (
            <div
              key={material._id}
              className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <h4 className="font-semibold">{material.title}</h4>
              <a
                href={material.file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Material;
