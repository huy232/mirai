import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import InfiniteScroll from "react-infinite-scroll-component"
import axios from "axios"
import { Card, Row, Col } from "react-bootstrap"
import { BsFillPlayFill } from "react-icons/bs"
import LoadingSpin from "react-loading-spin"
import useDocumentTitle from "../DocumentTitleHook"
import "./animelist.css"

const PAGE_NUMBER = 1

function AnimeList({ instance }) {
	const [animeList, setAnimeList] = useState([])
	const [page, setPage] = useState(PAGE_NUMBER)
	const [totalPage, setTotalPage] = useState(91)

	useEffect(() => {
		const CancelToken = axios.CancelToken
		const source = CancelToken.source()

		const getList = async () => {
			await instance
				.get(`/anime?page=${page}`, {
					cancelToken: source.token,
				})
				.then((response) => {
					const newList = response.data.data.map((anime) => ({
						slug: anime.slug,
						thumbnail: anime.thumbnail,
						name: anime.name,
						views: anime.views,
					}))
					setTotalPage(response.data.pagination.totalPage)
					setAnimeList((prev) => {
						return [...new Set([...prev, ...newList])]
					})
				})
				.catch((thrown) => {
					if (axios.isCancel(thrown)) return
				})
		}

		getList()

		return () => {
			source.cancel()
		}
	}, [page])

	useDocumentTitle("Tất cả Anime - Mirai")

	const scrollThreshold = () => {
		const newPage = page + 1
		setPage(newPage)
	}

	return (
		<>
			<div
				className="title-wrapper"
				style={{ textAlign: "center", margin: "20px 0" }}
			>
				<h1 style={{ display: "inline-block" }}>TẤT CẢ ANIME</h1>
			</div>

			<div className="anime-list">
				<InfiniteScroll
					style={{ overflow: "none" }}
					dataLength={animeList.length}
					next={scrollThreshold}
					hasMore={page === totalPage ? false : true}
					loader={
						<div
							className="loading-spin"
							style={{ textAlign: "center", marginTop: "50px" }}
						>
							<LoadingSpin primaryColor="red" />
						</div>
					}
				>
					<Row xs={1} sm={2} md={3} lg={4} className="w-100 w-full row-anime">
						{animeList.map((anime) => (
							<Col key={anime.slug}>
								<nav>
									<Link to={`/info/${anime.slug}`}>
										<Card>
											<div className="card-container">
												<Card.Img
													variant="top"
													src={anime.thumbnail}
													fluid="true"
												/>
												<div className="overlay-card">
													<div className="icon">
														{<BsFillPlayFill size={40} />}
													</div>
												</div>
											</div>
											<Card.Body>
												<Card.Title>
													<p className="webclamp">{anime?.name}</p>
												</Card.Title>
											</Card.Body>
										</Card>
									</Link>
								</nav>
								<div className="w-100"></div>
							</Col>
						))}
					</Row>
				</InfiniteScroll>
			</div>
		</>
	)
}

export default AnimeList
