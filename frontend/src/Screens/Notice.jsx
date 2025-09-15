import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Heading from '../components/ui/Heading';
import Loading from '../components/ui/Loading';
import NoData from '../components/ui/NoData';
import CustomButton from '../components/ui/CustomButton';
import Modal from '../components/ui/Modal';
import { useSelector } from 'react-redux';
import { noticeService } from '../services/noticeService';

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processLoading, setProcessLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const userType = useSelector((state) => state.auth.userType);
  const isAdminOrFaculty = userType === 'admin' || userType === 'faculty';

  const getNotices = async () => {
    setIsLoading(true);
    try {
      const { data } = await noticeService.search();
      setNotices(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch notices');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getNotices();
  }, []);

  const addNoticeHandler = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      return toast.error('Please fill all fields');
    }
    setProcessLoading(true);
    toast.loading('Adding Notice...');
    try {
      const { data } = await noticeService.add({ title, description });
      toast.dismiss();
      if (data?.success) {
        toast.success(data.message);
        setShowAddForm(false);
        setTitle('');
        setDescription('');
        getNotices();
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error?.response?.data?.message || 'Something went wrong.');
    } finally {
      setProcessLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <Heading title="Notice Board" />
        {isAdminOrFaculty && (
          <CustomButton onClick={() => setShowAddForm(true)}>
            Add Notice
          </CustomButton>
        )}
      </div>

      {isLoading ? (
        <Loading />
      ) : notices.length === 0 ? (
        <NoData message="No notices available at the moment." />
      ) : (
        <div className="mt-6 space-y-4">
          {notices.map((notice) => (
            <div key={notice._id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">
                {notice.title}
              </h3>
              <p className="text-gray-600 mt-2">{notice.description}</p>
              <div className="text-right text-sm text-gray-500 mt-4">
                <p>Posted by: {notice.createdBy?.name || 'Admin'}</p>
                <p>Date: {new Date(notice.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <Modal
          title="Add New Notice"
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
        >
          <form onSubmit={addNoticeHandler} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter notice title"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter notice description"
              ></textarea>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <CustomButton
                type="button"
                variant="secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </CustomButton>
              <CustomButton
                type="submit"
                loading={processLoading}
                disabled={processLoading}
              >
                Add Notice
              </CustomButton>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Notice;
