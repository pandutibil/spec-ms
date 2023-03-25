import { PipelineGenericService } from './../service/pipeline-generic/piepline-generic.service';
import {EventService} from './../service/event/event.service';
import {DimensionService} from './../service/dimension/dimension.service';
import {Body, Controller, Get, Param, Post, Res, Query} from '@nestjs/common';
import {Response} from 'express';
import {
    pipelineDto,
    Result,
    specDataset,
    specTrasformer,
    specDimensionDTO,
    scheduleDto,
    specEventDTO,
    s3DTO, GetGrammar
} from '../dto/specData.dto';
import {TransformerService} from '../service/transformer/transformer.service';
import {DatasetService} from '../service/dataset/dataset.service';
import {ScheduleService} from '../service/schedule/schedule.service';
import {ApiTags} from '@nestjs/swagger';
import {S3Service} from '../service/s3/s3.service';
import { PipelineService } from '../service/pipeline-old/pipeline.service';
import {Grammar} from '../service/grammar/grammar.service';

@ApiTags('spec-ms')
@Controller('/spec')
export class SpecificationController {
    constructor(private dimensionService: DimensionService, private EventService: EventService, private transformerservice: TransformerService, private datasetService: DatasetService,
                private pipelineService: PipelineService, private scheduleService: ScheduleService, private s3service: S3Service,private pipelineGeneric:PipelineGenericService, private grammar: Grammar) {
    }

    @Get('/hello')
    async getHello() {
        return {"message": "Hello World"}
    }

    @Post('/dimension')
    async getDimensions(@Body() dimensionDTO: specDimensionDTO, @Res()response: Response) {
        try {
            let result = await this.dimensionService.createDimension(dimensionDTO);
            if (result.code == 400) {
                response.status(400).send({"message": result.error});
            }
            else {
                response.status(200).send({
                    "message": result.message,
                    "dimension_name": result.program,
                });
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    @Post('/event')
    async getEvents(@Body() eventDTO: specEventDTO, @Res()response: Response) {
        try {
            let result = await this.EventService.createEvent(eventDTO);
            if (result.code == 400) {
                response.status(400).send({"message": result.error});
            }
            else {
                response.status(200).send({
                    "message": result.message,
                    "program": result?.program
                });
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    @Post('/dataset')
    async getDataset(@Body() datasetDTO: specDataset, @Res()response: Response) {
        try {
            let result = await this.datasetService.createDataset(datasetDTO);
            if (result.code == 400) {
                response.status(400).send({"message": result.error});
            }
            else {
                response.status(200).send({
                    "message": result.message,
                    "dataset_name": result?.dataset_name,
                    "pid": result.pid
                });
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    @Post('/transformer')
    async createTransformer(@Body() transformerDTO: specTrasformer, @Res()response: Response) {
        try {
            const result: any = await this.transformerservice.createTransformer(transformerDTO)
            if (result.code == 400) {
                response.status(400).send({"message": result.error});
            }
            else {
                response.status(200).send({"message": result.message, "response": result.response});
            }
        } catch (error) {
            console.error("create.Transformer impl :", error)
            throw new Error(error);
        }
    }

    @Post('/pipeline-old')
    async createPipeline(@Body() pipelineDto: pipelineDto, @Res()response: Response) {
        try {
            const result: Result = await this.pipelineService.createSpecPipeline(pipelineDto)
            if (result?.code == 400) {
                response.status(400).send({"message": result.error});
            }
            else {
                response.status(200).send({"message": result.message});
            }
        } catch (error) {
            console.error("create.Pipeline impl :", error)
        }
    }
    @Post('/pipeline')
    async createPipelineSpec(@Body() pipelineDto: pipelineDto, @Res()response: Response) {
        try {
            const result: Result = await this.pipelineGeneric.createSpecPipeline(pipelineDto)
            if (result?.code == 400) {
                response.status(400).send({"message": result.error});
            }
            else {
                response.status(200).send({"message": result.message});
            }
        } catch (error) {
            console.error("create.Pipeline impl :", error)
        }
    }

    @Post('/schedule')
    async schedulePipeline(@Body() scheduleDto: scheduleDto, @Res()response: Response) {
        try {
            const result: Result = await this.scheduleService.schedulePipeline(scheduleDto)
            if (result?.code == 400) {
                response.status(400).send({"message": result.error});
            }
            else {
                response.status(200).send({"message": result?.message});
            }
        } catch (error) {
            console.error("schedule.Pipeline impl :", error)
        }
    }

    @Post('/s3')
    async uploadToS3(@Body() scheduleTime: s3DTO, @Res()response: Response) {
        try {
            let result: any = await this.s3service.uploadFile(scheduleTime);
            if (result.code == 400) {
                response.status(400).send({"message": result.error});
            } else {
                response.status(200).send({"message": result.message});
            }
        }
        catch (e) {
            console.error('create-s3upload-impl: ', e.message);
            throw new Error(e);
        }
    }

    
    @Post('/pipeline')
    async createSpecPipeline(@Body() pipelineDto: pipelineDto, @Res()response: Response) {
        try {
            const result: any = await this.pipelineService.createSpecPipeline(pipelineDto);
            if (result?.code == 400) {
                response.status(400).send({"message": result.error});
            }
            else {
                response.status(200).send({"message": result.message});
            }
        } catch (error) {
            console.error('createSpecPipelineNew: ', error);
        }
    }

    @Get('/grammar')
    async getGrammar(@Query()getGrammar: GetGrammar, @Res() response: Response) {
        try {
            const result: any = await this.grammar.getGrammar(getGrammar);
            if (result?.code == 400) {
                response.status(400).send({"message": result.error});
            }
            else {
                response.status(200).send({"schema": result.data.schema});
            }
        } catch (error) {
            console.error('specification.controller.getGrammar: ', error);
            throw new Error(error);
        }
    }
}
