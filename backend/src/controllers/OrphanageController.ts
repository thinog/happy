import { getRepository } from 'typeorm';
import '../database/connection';
import Orphanage from '../models/Orphanage';
import { Request, Response } from 'express';
import orphanageView from '../views/orphanage_view';
import Image from '../models/Image';
import * as Yup from 'yup';

export default {
	async index(req: Request, res: Response) {
		const orphanageRepository = getRepository(Orphanage);

		const orphanages = await orphanageRepository.find({ relations: ['images'] });

		return res.status(200).json(orphanages.map((orphanage) => orphanageView.render(orphanage)));
	},

	async show(req: Request, res: Response) {
		const { id } = req.params;

		const orphanageRepository = getRepository(Orphanage);

		const orphanage = await orphanageRepository.findOneOrFail(id, { relations: ['images'] });

		return res.status(200).json(orphanageView.render(orphanage));
	},

	async create(req: Request, res: Response) {
    const orphanage = req.body as Orphanage;
    const { open_on_weekends } = req.body; 
    orphanage.open_on_weekends = open_on_weekends === true || open_on_weekends === 'true';
    
		const requestImages = req.files as Express.Multer.File[];
		orphanage.images = requestImages.map((image) => {
			return { path: image.filename };
		}) as Image[];

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required()
        })
      )
    });
    
    await schema.validate(orphanage, {abortEarly: false});

		const orphanageRepository = getRepository(Orphanage);
    
		orphanageRepository.create(orphanage);
    
		await orphanageRepository.save({...orphanage});

		return res.status(201).json(orphanageView.render(orphanage));
	},
};
