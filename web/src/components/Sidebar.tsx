import React from 'react';
import { FiArrowLeft } from "react-icons/fi";
import { useHistory } from 'react-router-dom';

import mapMarkerImg from '../images/map-marker.svg';
import '../styles/components/sidebar.css';

interface SidebarProps {
  expanded?: boolean
}

export default function Sidebar(props: SidebarProps) {
  const { goBack } = useHistory();

  if(props && props.expanded === true){
    return (
			<aside className="app-sidebar-expanded">
				<header>
					<img src={mapMarkerImg} alt='Happy' />

					<h2>Escolha um orfanato no mapa</h2>
					<p>Muitas crianças estão esperando a sua visita :)</p>
				</header>

				<footer>
					<strong>São Paulo</strong>
					<span>São Paulo</span>
				</footer>
			</aside>
    );
  }

	return (
		<aside className="app-sidebar">
			<img src={mapMarkerImg} alt='Happy' />

			<footer>
				<button type='button' onClick={goBack}>
					<FiArrowLeft size={24} color='#FFF' />
				</button>
			</footer>
		</aside>
	);
}
