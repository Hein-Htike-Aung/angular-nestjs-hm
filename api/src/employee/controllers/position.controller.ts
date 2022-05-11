import { PositionService } from './../services/position.service';
import { Controller } from '@nestjs/common';

@Controller('position')
export class PositionController {
    constructor(private positionSerice: PositionService) {}
}
