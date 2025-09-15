const Material = require('../models/material.model');
const ApiError = require('../utils/ApiError');

const getMaterials = async (queryParams) => {
  const { subject, faculty, semester, branch, type } = queryParams;
  let query = {};

  if (subject) query.subject = subject;
  if (faculty) query.faculty = faculty;
  if (semester) query.semester = semester;
  if (branch) query.branch = branch;
  if (type) query.type = type;

  const materials = await Material.find(query)
    .populate('subject')
    .populate('faculty')
    .populate('branch')
    .sort({ createdAt: -1 });

  if (!materials || materials.length === 0) {
    throw new ApiError(404, 'No materials found');
  }

  return materials;
};

const addMaterial = async (materialData, file, userId) => {
  if (!file) {
    throw new ApiError(400, 'Material file is required');
  }

  const material = await Material.create({
    ...materialData,
    faculty: userId,
    file: file.filename,
  });

  return await Material.findById(material._id)
    .populate('subject')
    .populate('faculty')
    .populate('branch');
};

const updateMaterial = async (materialId, materialData, file, userId) => {
  const material = await Material.findById(materialId);

  if (!material) {
    throw new ApiError(404, 'Material not found');
  }

  if (material.faculty.toString() !== userId) {
    throw new ApiError(401, 'You are not authorized to update this material');
  }

  if (file) {
    materialData.file = file.filename;
  }

  return await Material.findByIdAndUpdate(materialId, materialData, {
    new: true,
  })
    .populate('subject')
    .populate('faculty')
    .populate('branch');
};

const deleteMaterial = async (materialId, userId) => {
  const material = await Material.findById(materialId);

  if (!material) {
    throw new ApiError(404, 'Material not found');
  }

  if (material.faculty.toString() !== userId) {
    throw new ApiError(401, 'You are not authorized to delete this material');
  }

  await Material.findByIdAndDelete(materialId);
};

module.exports = {
  getMaterials,
  addMaterial,
  updateMaterial,
  deleteMaterial,
};
