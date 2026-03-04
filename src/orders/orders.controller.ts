import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, Query, ParseEnumPipe } from '@nestjs/common';
import { CreateOrderDto, OrderPaginationDto, StatusDto, UpdateOrderDto } from './dto/index';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ORDERS_SERVICE } from 'src/config';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy,
  ) { }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return firstValueFrom(
      this.ordersClient.send('createOrder', createOrderDto).pipe(
        catchError(error => {
          throw new RpcException(error);
        }),
      ),
    );
  }

  @Get()
  async findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return firstValueFrom(
      this.ordersClient.send('findAllOrders', orderPaginationDto).pipe(
        catchError(error => {
          throw new RpcException(error);
        }),
      ),
    );
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return firstValueFrom(
      this.ordersClient.send('findOneOrder', { id }).pipe(
        catchError(error => {
          throw new RpcException(error);
        }),
      ),
    );
  }

  @Get(':status')
  async findAllByStatus(@Param() statusDto: StatusDto, @Query() paginationDto: PaginationDto) {
    return firstValueFrom(
      this.ordersClient.send('findAllOrders', { ...paginationDto, status: statusDto.status }).pipe(
        catchError(error => {
          throw new RpcException(error);
        }),
      ),
    );
  }

  @Patch(':id')
  async changeStatus(@Param('id', ParseUUIDPipe) id: string, @Body() statusDto: StatusDto) {
    return firstValueFrom(
      this.ordersClient.send('changeOrderStatus', { id, status: statusDto.status }).pipe(
        catchError(error => {
          throw new RpcException(error);
        }),
      ),
    );
  }
}
