import { SetMetadata } from '@nestjs/common';

export const PublicRoute = () => SetMetadata('Public', true);
