import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import "./animeinfo.css"

function AnimeInfo({ instance }) {
	const { anime } = useParams()

	const [info, setInfo] = useState({})

	useEffect(() => {
		window.scrollTo(0, 0)
		window.history.scrollRestoration = "manual"

		const CancelToken = axios.CancelToken
		const source = CancelToken.source()

		const getList = async () => {
			await instance
				.get(`/info/${anime}`, {
					cancelToken: source.token,
				})
				.then((response) => {
					setInfo(response.data.data)
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
			<div
				className="banner-anime-overlay w-100 w-full"
				style={{
					zIndex: 0,
					position: "relative",
					marginTop: "-90px",
					maxHeight: "450px",
					minHeight: "450px",
					overflow: "hidden",
				}}
			>
				<div className="banner-anime-image">
					<img src={info.animeInfo?.BannerImg} className="mw-100 w-100" />
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
								maxHeight: "330px",
								maxWidth: "160px",
								minWidth: "160px",
								minHeight: "330px",
								marginTop: "-5rem",
								marginLeft: "3rem",
							}}
						>
							<img
								src={info.animeInfo?.CoverImg?.large}
								className="cover-image"
							/>
						</div>
					</div>
					<div className="info-detail ">
						<div className="anime-title">
							<h2 style={{ color: `${info?.animeInfo?.CoverImg?.color}` }}>
								{info?.name}
							</h2>
						</div>
						<div className="description">
							<p>{info?.description}</p>
						</div>
						<div className="bottom-detail">
							<div className="country">
								<h6>Quốc gia</h6>{" "}
								<div className="country-element">
									{info?.animeInfo?.Country}
								</div>
							</div>
							<div className="score">
								<h6>Điểm số</h6>{" "}
								<div className="score-element">{info?.animeInfo?.Score}</div>
							</div>
							<div className="duration">
								<h6>Thời lượng tập phim</h6>
								<div className="duration-element">
									{info?.animeInfo?.Duration} phút
								</div>
							</div>
							<div className="views">
								<h6>Lượt xem</h6>
								<div className="views-element">
									{info?.views?.toLocaleString()}
								</div>
							</div>
							<div className="release-date">
								<h6>KHỞI CHIẾU</h6>
								<div className="release-date-element">
									{!info?.animeInfo?.StartDate?.day
										? ""
										: `Ngày ${info?.animeInfo?.StartDate?.day} `}
									{!info?.animeInfo?.StartDate?.month
										? ""
										: `Tháng ${info?.animeInfo?.StartDate?.month} `}
									{!info?.animeInfo?.StartDate?.year
										? ""
										: `Năm ${info?.animeInfo?.StartDate?.year}`}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default AnimeInfo