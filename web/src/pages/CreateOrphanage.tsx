import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { FiPlus } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import mapIcon from '../utils/mapIcon';
import '../styles/pages/create-orphanage.css';
import Orphanage from './Orphanage';
import api from '../services/api';
import { useHistory } from 'react-router-dom';

export default function CreateOrphanage() {
  const history = useHistory();

	const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
	const [name, setName] = useState('');
	const [about, setAbout] = useState('');
	const [instructions, setInstructions] = useState('');
	const [openingHours, setOpeningHours] = useState('');
	const [openOnWeekends, setOpenOnWeekends] = useState(true);
	const [images, setImages] = useState<File[]>([]);
	const [previewImages, setPreviewImages] = useState<string[]>([]);

	function handleMapClick(evnt: LeafletMouseEvent) {
		const { lat, lng } = evnt.latlng;

		setPosition({
			latitude: lat,
			longitude: lng,
		});
	}

	async function handleSubmit(evnt: FormEvent) {
    evnt.preventDefault();
    
    const data = new FormData();

    data.append('name', name);
    data.append('latitude', String(position.latitude));
    data.append('longitude', String(position.longitude));
    data.append('about', about);
    data.append('instructions', instructions);
    data.append('opening_hours', openingHours);
    data.append('open_on_weekends', String(openOnWeekends));
    
    images.forEach(image => {
      data.append('images', image);
    });

    await api.post('orphanages', data);

    alert('Cadastro realizado com sucesso!');

    history.push('/app');
	}

	function handleSelectImages(evnt: ChangeEvent<HTMLInputElement>) {
		if (!evnt.target.files) return;

		const files = Array.from(evnt.target.files);
		setImages(files);

		const preview = files.map((file) => URL.createObjectURL(file));
		setPreviewImages(preview);
	}

	return (
		<div id='page-create-orphanage'>
			<Sidebar />

			<main>
				<form onSubmit={handleSubmit} className='create-orphanage-form'>
					<fieldset>
						<legend>Dados</legend>

						<Map center={[-23.6025873, -46.6531101]} style={{ width: '100%', height: 280 }} zoom={11.75} onClick={handleMapClick}>
							<TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} />

							{position.latitude !== 0 && <Marker interactive={false} icon={mapIcon} position={[position.latitude, position.longitude]} />}
						</Map>

						<div className='input-block'>
							<label htmlFor='name'>Nome</label>
							<input id='name' value={name} onChange={(e) => setName(e.target.value)} />
						</div>

						<div className='input-block'>
							<label htmlFor='about'>
								Sobre <span>Máximo de 300 caracteres</span>
							</label>
							<textarea id='about' maxLength={300} value={about} onChange={(e) => setAbout(e.target.value)} />
						</div>

						<div className='input-block'>
							<label htmlFor='images'>Fotos</label>

							<div className='images-container'>
								{previewImages.map((image) => {
									return <img src={image} alt={name} />;
								})}

								<label className='new-image' htmlFor='image[]'>
									<FiPlus size={24} color='#15b6d6' />
								</label>
							</div>

							<input multiple onChange={handleSelectImages} type='file' id='image[]' />
						</div>
					</fieldset>

					<fieldset>
						<legend>Visitação</legend>

						<div className='input-block'>
							<label htmlFor='instructions'>Instruções</label>
							<textarea id='instructions' value={instructions} onChange={(e) => setInstructions(e.target.value)} />
						</div>

						<div className='input-block'>
							<label htmlFor='opening_hours'>Horário de funcionamento</label>
							<input id='opening_hours' value={openingHours} onChange={(e) => setOpeningHours(e.target.value)} />
						</div>

						<div className='input-block'>
							<label htmlFor='open_on_weekends'>Atende fim de semana</label>

							<div className='button-select'>
								<button type='button' className={openOnWeekends ? 'active' : ''} onClick={() => setOpenOnWeekends(true)}>
									Sim
								</button>
								<button type='button' className={!openOnWeekends ? 'active' : ''} onClick={() => setOpenOnWeekends(false)}>
									Não
								</button>
							</div>
						</div>
					</fieldset>

					<button className='confirm-button' type='submit'>
						Confirmar
					</button>
				</form>
			</main>
		</div>
	);
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
