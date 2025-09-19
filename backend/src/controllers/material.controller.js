const materialService = require('../services/material.service');
const ApiResponse = require('../utils/ApiResponse');
const { USER_ROLES } = require('../utils/constants');

const getMaterialsController = async (req, res, next) => {
  try {
    const materials = await materialService.getMaterials(req.query);
    return ApiResponse.success(materials,'Materials retrieved successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const addMaterialController = async (req, res, next) => {
  try {
    if (req.user.role !== USER_ROLES.FACULTY) {
      return ApiResponse.forbidden(
        'Access denied. Only faculty can add materials.'
      ).send(res);
    }

    const populatedMaterial = await materialService.addMaterial(
      req.body,
      req.file,
      req.user.userId
    );
    return ApiResponse.created(populatedMaterial,'Material created successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const updateMaterialController = async (req, res, next) => {
  try {
    if (req.user.role !== USER_ROLES.FACULTY) {
      return ApiResponse.forbidden(
        'Access denied. Only faculty can update materials.'
      ).send(res);
    }

    const updatedMaterial = await materialService.updateMaterial(
      req.params.id,
      req.body,
      req.file,
      req.user.userId
    );
    return ApiResponse.success(updatedMaterial,'Material updated successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const deleteMaterialController = async (req, res, next) => {
  try {
    if (req.user.role !== USER_ROLES.FACULTY) {
      return ApiResponse.forbidden(
        'Access denied. Only faculty can delete materials.'
      ).send(res);
    }

    await materialService.deleteMaterial(req.params.id, req.user.userId);
    return ApiResponse.success(null, 'Material deleted successfully').send(res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMaterialsController,
  addMaterialController,
  updateMaterialController,
  deleteMaterialController,
};
