/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Skeleton from "@mui/material/Skeleton"
import axios from "axios"
import ReactPlayer from "react-player"
import { Card, Row, Col } from "react-bootstrap"
import { BsFillPlayFill } from "react-icons/bs"
import "./animeinfo.css"

// SWIPER
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import SwiperCore, { Pagination, Navigation } from "swiper"
SwiperCore.use([Pagination, Navigation])

// ---------------------------

function AnimeInfo({ instance }) {
	const { anime } = useParams()

	const [info, setInfo] = useState({})
	const [videoUrl, setVideoUrl] = useState("")
	const [loading, setLoading] = useState(true)
	const [episodeList, setEpisodeList] = useState([])
	const [specialEpisodeList, setSpecialEpisodeList] = useState([])
	const [selectedChunk, setSelectedChunk] = useState(0)
	const [selectedSpecialChunk, setSelectedSpecialChunk] = useState(0)

	useEffect(() => {
		const CancelToken = axios.CancelToken
		const source = CancelToken.source()

		const getList = async () => {
			await instance
				.get(`/info/${anime}`, {
					cancelToken: source.token,
				})
				.then((response) => {
					setInfo(response.data.data)
					if (response.data.data?.animeInfo?.Trailer) {
						const url = response.data.data?.animeInfo?.Trailer
						const newUrl = url.replace(
							"https://www.youtube.com/watch?v=",
							"https://www.youtube-nocookie.com/embed/"
						)
						const myDomain = "&origin=https://mirai-huy8856.vercel.app/"

						const joinUrl = newUrl + myDomain
						setVideoUrl(joinUrl)
					}

					const episodeListChunk = []
					const specialEpisodeListChunk = []
					while (response.data.data.episodes.length) {
						episodeListChunk.push(response.data.data.episodes.splice(0, 12))
					}
					if (response.data.data?.special_episodes.length > 0) {
						while (response.data.data.special_episodes.length) {
							specialEpisodeListChunk.push(
								response.data.data.special_episodes.splice(0, 12)
							)
						}
					}
					document.title = response.data.data?.name
					setEpisodeList(episodeListChunk)
					setSpecialEpisodeList(specialEpisodeListChunk)
					setLoading(false)
				})
				.catch((thrown) => {
					if (axios.isCancel(thrown)) return
				})
		}

		getList()

		return () => {
			source.cancel()
		}
	}, [])
	return (
		<>
			<div className="banner-anime-overlay">
				<div className="banner-anime-image">
					{loading ? (
						<Skeleton
							variant="rectangular"
							width="100%"
							height="450px"
							animation="wave"
							sx={{ bgcolor: "grey.900" }}
						/>
					) : !info?.animeInfo?.BannerImg ? (
						<img
							src={info?.animeInfo?.BannerImg}
							className="banner-info-image"
							style={{ width: "auto" }}
						/>
					) : (
						<img
							src={info?.animeInfo?.BannerImg}
							className="banner-info-image"
						/>
					)}
				</div>
			</div>

			<div className="box-info" style={{ position: "relative" }}>
				<div
					className="info-box"
					style={{ display: "flex", flexDirection: "row", width: "100%" }}
				>
					<div className="cover-wrapper ">
						<div
							className="info-image"
							style={{
								display: "block",
								textAlign: "center",
								maxHeight: "330px",
								minHeight: "330px",
								marginTop: "-5rem",
							}}
						>
							{loading ? (
								<Skeleton
									variant="rectangular"
									width="160px"
									height="226px"
									animation="wave"
									sx={{ bgcolor: "grey.900" }}
									style={{ marginLeft: "auto", marginRight: "auto" }}
								/>
							) : (
								<img
									src={
										info?.animeInfo?.CoverImg?.large ||
										info?.animeInfo?.CoverImg?.medium ||
										info?.animeInfo?.CoverImg?.small
									}
									className="cover-image"
								/>
							)}
						</div>
						<div className="detail-cover-info">
							<div className="format">
								{info?.animeInfo?.Format ? (
									<>
										{" "}
										<h5>?????NH D???NG</h5> <p>{info?.animeInfo?.Format}</p>
									</>
								) : (
									""
								)}
							</div>
							<div className="title">
								{info?.animeInfo?.Format ? (
									<>
										{" "}
										<h5>T??N PHIM</h5>
										{info?.animeInfo?.Title?.romaji ? (
											<>
												<h6>
													ROMAJI <p>{info?.animeInfo?.Title?.romaji}</p>
												</h6>
											</>
										) : (
											""
										)}
										{info?.animeInfo?.Title?.english ? (
											<>
												<h6>
													TI???NG ANH <p>{info?.animeInfo?.Title?.english}</p>
												</h6>
											</>
										) : (
											""
										)}
										{info?.animeInfo?.Title?.native ? (
											<>
												<h6>
													TI???NG NH???T <p>{info?.animeInfo?.Title?.native}</p>
												</h6>
											</>
										) : (
											""
										)}
									</>
								) : (
									""
								)}
							</div>
							<div className="source">
								{info?.animeInfo?.Source ? (
									<>
										{" "}
										<h5>CHUY???N TH??? T???</h5> <p>{info?.animeInfo?.Source}</p>
									</>
								) : (
									""
								)}
							</div>
							<div className="popularity">
								{info?.animeInfo?.Popularity ? (
									<>
										{" "}
										<h5>????? N???I B???T</h5>{" "}
										<p>{info?.animeInfo?.Popularity.toLocaleString()}</p>
									</>
								) : (
									""
								)}
							</div>
							<div className="favourite">
								{info?.animeInfo?.Favourite ? (
									<>
										{" "}
										<h5>Y??U TH??CH</h5>{" "}
										<p>{info?.animeInfo?.Favourite.toLocaleString()}</p>
									</>
								) : (
									""
								)}
							</div>
							<div className="popularity">
								{info?.animeInfo?.Trending ? (
									<>
										{" "}
										<h5>TH???I TH?????NG</h5>{" "}
										<p>{info?.animeInfo?.Trending.toLocaleString()}</p>
									</>
								) : (
									""
								)}
							</div>
							<div className="studios">
								{info?.animeInfo?.Studio ? (
									<>
										{" "}
										<h5>STUDIO</h5>{" "}
										<p>
											{info?.animeInfo?.Studio.map((studio, i, arr) =>
												i != arr.length - 1
													? `${studio.name + ", "}`
													: `${studio.name}`
											)}
										</p>
									</>
								) : (
									""
								)}
							</div>
						</div>
					</div>
					<div className="info-detail ">
						<div className="anime-title">
							<h2 style={{ color: `${info?.animeInfo?.CoverImg?.color}` }}>
								{loading ? (
									<Skeleton
										variant="text"
										animation="wave"
										sx={{ bgcolor: "grey.900" }}
									/>
								) : (
									info?.name
								)}
							</h2>
						</div>
						<div className="description">
							<p>
								{loading ? (
									<Skeleton
										variant="text"
										animation="wave"
										sx={{ bgcolor: "grey.900" }}
									/>
								) : !info?.description ? (
									""
								) : (
									`${info?.description}`
								)}
							</p>
						</div>
						<div className="bottom-detail" style={{ marginTop: "50px" }}>
							<div className="country">
								<h6>QU???C GIA</h6>{" "}
								<div className="country-element">
									{!info?.animeInfo?.Country
										? ""
										: `${info?.animeInfo?.Country}`}
								</div>
							</div>
							<div className="score">
								<h6>??I???M S???</h6>{" "}
								<div className="score-element">{info?.animeInfo?.Score}</div>
							</div>
							<div className="duration">
								<h6>TH???I L?????NG</h6>
								<div className="duration-element">
									{!info?.animeInfo?.Duration
										? ""
										: `${info?.animeInfo?.Duration} ph??t`}
								</div>
							</div>
							<div className="views">
								<h6>L?????T XEM</h6>
								<div className="views-element">
									{info?.views?.toLocaleString()}
								</div>
							</div>
							<div className="release-date">
								<h6>KH???I CHI???U</h6>
								<div className="release-date-element">
									{!info?.animeInfo?.StartDate?.day
										? ""
										: `Ng??y ${info?.animeInfo?.StartDate?.day} `}
									{!info?.animeInfo?.StartDate?.month
										? ""
										: `Th??ng ${info?.animeInfo?.StartDate?.month} `}
									{!info?.animeInfo?.StartDate?.year
										? ""
										: `N??m ${info?.animeInfo?.StartDate?.year}`}
								</div>
							</div>
						</div>

						<div
							className="box-anime-film-trailer"
							style={{ marginTop: "40px" }}
						>
							{videoUrl ? (
								<>
									<h3>XEM TH??? N???U B???N CH??A R??</h3>
									<div className="youtube-link">
										<ReactPlayer url={videoUrl} controls={true} />
									</div>
								</>
							) : (
								""
							)}
						</div>
						<div className="episode-wrapper" style={{ marginTop: "35px" }}>
							<div className="episode-list">
								<h4>DANH S??CH T???P PHIM</h4>
								<Swiper
									slidesPerView="auto"
									className="swiper-container"
									navigation={false}
									pagination={{
										type: "fraction",
									}}
								>
									{episodeList.map((episodeChunk, i) => (
										<SwiperSlide
											onClick={() => {
												setSelectedChunk(i)
											}}
											key={i}
											style={{
												width: "160px",
											}}
										>
											<li
												className="episode-chunk"
												style={
													selectedChunk === i
														? {
																color: "black",
																backgroundColor: "white",
																borderRadius: "8px",
																transition: "all 0.4s linear",
														  }
														: {}
												}
											>
												{`${episodeChunk[0].name} - ${
													episodeChunk[episodeChunk.length - 1].name
												}`}
											</li>
										</SwiperSlide>
									))}
								</Swiper>
							</div>
							<div id="spacer" style={{ width: "100%", height: "165px" }}></div>
							<div className="episode-list-detail">
								<Row
									xs={1}
									sm={2}
									md={3}
									lg={4}
									className="w-100 g-4 episode-anime-row"
								>
									{episodeList[selectedChunk]?.map((eachEpisode, i) => (
										<Col key={i}>
											<nav>
												{info?.name == "Vua H???i T???c" ? (
													<Link
														to={`/watch/${anime}?index=${eachEpisode.name}`}
													>
														<Card>
															<div className="card-container">
																<Card.Img
																	variant="top"
																	src={
																		eachEpisode?.thumbnail_medium ||
																		eachEpisode?.thumbnail_small
																	}
																/>
																<div className="overlay-card">
																	<div className="icon">
																		{<BsFillPlayFill size={40} />}
																	</div>
																</div>
															</div>
															<Card.Body>
																<Card.Title>
																	{eachEpisode?.full_name == "Trailer" ? (
																		"Movie"
																	) : (
																		<p className="webclamp">
																			{eachEpisode?.full_name}
																		</p>
																	)}
																</Card.Title>
															</Card.Body>
														</Card>
													</Link>
												) : eachEpisode.name > 0 ? (
													<Link
														to={`/watch/${anime}?index=${eachEpisode.name - 1}`}
													>
														<Card>
															<div className="card-container">
																<Card.Img
																	variant="top"
																	src={
																		eachEpisode?.thumbnail_medium ||
																		eachEpisode?.thumbnail_small
																	}
																/>
																<div className="overlay-card">
																	<div className="icon">
																		{<BsFillPlayFill size={40} />}
																	</div>
																</div>
															</div>
															<Card.Body
																style={{ minHeight: "4.8rem", maxHeight: "4.8rem" }}
															>
																<Card.Title>
																	{eachEpisode?.full_name == "Trailer" ? (
																		"Movie"
																	) : (
																		<p className="webclamp">
																			{eachEpisode?.full_name}
																		</p>
																	)}
																</Card.Title>
															</Card.Body>
														</Card>
													</Link>
												) : (
													<Link
														to={`/watch/${anime}?index=${eachEpisode.name}`}
													>
														<Card>
															<div className="card-container">
																<Card.Img
																	variant="top"
																	src={
																		eachEpisode?.thumbnail_medium ||
																		eachEpisode?.thumbnail_small
																	}
																/>
																<div className="overlay-card">
																	<div className="icon">
																		{<BsFillPlayFill size={40} />}
																	</div>
																</div>
															</div>
															<Card.Body>
																<Card.Title>
																	{eachEpisode?.full_name == "Trailer" ? (
																		"Movie"
																	) : (
																		<p className="webclamp">
																			{eachEpisode?.full_name}
																		</p>
																	)}
																</Card.Title>
															</Card.Body>
														</Card>
													</Link>
												)}
											</nav>
										</Col>
									))}
								</Row>
							</div>
						</div>

						{specialEpisodeList.length > 0 ? (
							<div
								className="special-episode-wrapper"
								style={{ marginTop: "46px" }}
							>
								<div className="episode-list">
									<h4>DANH S??CH T???P ??I???M T??M</h4>
									<Swiper
										slidesPerView="auto"
										className="swiper-container"
										navigation={false}
										pagination={{
											type: "fraction",
										}}
									>
										{specialEpisodeList.map((episodeChunk, i) => (
											<SwiperSlide
												onClick={() => {
													setSelectedSpecialChunk(i)
												}}
												key={i}
												style={{
													width: "160px",
												}}
											>
												<li
													className="episode-chunk"
													style={
														selectedSpecialChunk === i
															? {
																	color: "black",
																	backgroundColor: "white",
																	borderRadius: "8px",
																	transition: "all 0.4s linear",
															  }
															: {}
													}
												>
													{`${i}`}
												</li>
											</SwiperSlide>
										))}
									</Swiper>
								</div>
								<div
									id="spacer"
									style={{ width: "100%", height: "165px" }}
								></div>
								<div className="episode-list-detail">
									<Row
										xs={1}
										sm={2}
										md={3}
										lg={4}
										className="w-100 g-4 episode-anime-row"
									>
										{specialEpisodeList[selectedSpecialChunk]?.map(
											(eachEpisode, i) => (
												<Col key={i}>
													<nav>
														<Link
															to={`/watch/${anime}?specialid=${eachEpisode.id}`}
														>
															<Card>
																<div className="card-container">
																	<Card.Img
																		variant="top"
																		src={
																			eachEpisode?.thumbnail_medium ||
																			eachEpisode?.thumbnail_small
																		}
																	/>
																	<div className="overlay-card">
																		<div className="icon">
																			{<BsFillPlayFill size={40} />}
																		</div>
																	</div>
																</div>
																<Card.Body>
																	<Card.Title>
																		<p className="webclamp">
																			{eachEpisode?.full_name}
																		</p>
																	</Card.Title>
																</Card.Body>
															</Card>
														</Link>
													</nav>
												</Col>
											)
										)}
									</Row>
								</div>
							</div>
						) : (
							""
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default AnimeInfo
