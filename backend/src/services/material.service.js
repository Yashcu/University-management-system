const Material = require('../models/material.model');

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
    const err = new Error('No materials found');
    err.status = 404;
    throw err;
  }

  return materials;
};

const addMaterial = async (materialData, file, userId) => {
  if (!file) {
    const err = new Error('Material file is required');
    err.status = 400;
    throw err;
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
    const err = new Error('Material not found');
    err.status = 404;
    throw err;
  }

  if (material.faculty.toString() !== userId) {
    const err = new Error('You are not authorized to update this material');
    err.status = 401;
    throw err;
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
    const err = new Error('Material not found');
    err.status = 404;
    throw err;
  }

  if (material.faculty.toString() !== userId) {
    const err = new Error('You are not authorized to delete this material');
    err.status = 401;
    throw err;
  }

  await Material.findByIdAndDelete(materialId);
};

module.exports = {
  getMaterials,
  addMaterial,
  updateMaterial,
  deleteMaterial,
};
