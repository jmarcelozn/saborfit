import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.js';
import ordersService from '../services/orders.service.js';

const ordersController = {
  createOrder: asyncHandler(async (req, res) => {
    const result = await ordersService.createOrder(req.user.id, req.body);
    return successResponse(res, result, 201);
  }),

  getMyOrders: asyncHandler(async (req, res) => {
    const orders = await ordersService.getMyOrders(req.user.id);
    return successResponse(res, orders);
  }),

  getOrderById: asyncHandler(async (req, res) => {
    const pedido = await ordersService.getOrderById(
      Number(req.params.id),
      req.user.id
    );
    return successResponse(res, pedido);
  }),

  adminGetAllOrders: asyncHandler(async (req, res) => {
    const { page, limit, status } = req.query;
    const result = await ordersService.adminGetAllOrders({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      status,
    });
    return successResponse(res, result);
  }),

  adminGetOrderById: asyncHandler(async (req, res) => {
    const pedido = await ordersService.adminGetOrderById(Number(req.params.id));
    return successResponse(res, pedido);
  }),

  adminUpdateStatus: asyncHandler(async (req, res) => {
    const pedido = await ordersService.adminUpdateStatus(
      Number(req.params.id),
      req.body.status
    );
    return successResponse(res, pedido);
  }),
};

export default ordersController;