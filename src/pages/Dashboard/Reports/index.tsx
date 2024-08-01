import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { IReport } from '../../../interfaces/IReport';
import Sidebar from '../../../components/common/Sidebar';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Reports = () => {
	const { token } = useAuth();
	const [reports, setReports] = useState<IReport[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [filters, setFilters] = useState<{ start_date: string; end_date: string }>({ start_date: '', end_date: '' });
	const [reportType, setReportType] = useState('performance');
	const [startDate, setStartDate] = useState(() => {
		const date = new Date();
		return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
	});
	const [endDate, setEndDate] = useState(() => {
		const date = new Date();
		date.setDate(date.getDate() - 1);
		return date.toISOString().split('T')[0];
	});
	const baseURL = import.meta.env.VITE_API_BASE_URL;

	useEffect(() => {
		const fetchReportData = async () => {
			if (filters.start_date && filters.end_date) {
				setLoading(true);
				try {
					const url = new URL(`${baseURL}/reports/${reportType}`);
					url.searchParams.append('page', page.toString());
					url.searchParams.append('start_date', filters.start_date);
					url.searchParams.append('end_date', filters.end_date);
					const response = await fetch(url.toString(), {
						method: 'GET',
						headers: {
							Accept: 'application/json',
							Authorization: `Bearer ${token}`,
						},
					});
					const data = await response.json();

					setReports(data.data.data);
					setTotalPages(data.data.last_page);
				} catch (error) {
					console.error('Erro ao buscar relatórios', error);
				} finally {
					setLoading(false);
				}
			}
		};
		fetchReportData();
	}, [token, page, filters, reportType, baseURL]);

	const handleFilterChange = (newFilters: { start_date: string; end_date: string }) => {
		setFilters(newFilters);
		setPage(1);
	};

	const handleReportTypeChange = (newType: string) => {
		setReportType(newType);
		setPage(1);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleFilterChange({ start_date: startDate, end_date: endDate });
	};

	const exportToPDF = (reports: IReport[], reportType: string) => {
		const doc = new jsPDF();

		const head: string[] = [];
		const body: (string | number)[][] = [];

		switch (reportType) {
			case 'performance':
				doc.text('Relatório de Performance', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
				head.push('Data', 'Total de Reservas');
				body.push(...reports.map(report => [report.date, report.total_reservations ?? 0]));
				break;
			case 'financial':
				doc.text('Relatório Financeiro', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
				head.push('Data', 'Valor Total', 'Total de Transações');
				body.push(...reports.map(report => [report.date, report.total_amount ?? '0', report.total_transactions ?? 0]));
				break;
			case 'users':
				doc.text('Relatório de Usuarios', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
				head.push('Data', 'Total de Usuários');
				body.push(...reports.map(report => [report.date, report.total_users ?? 0]));
				break;
			case 'occupancy':
				doc.text('Relatório de Ocupação', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
				head.push('ID do Campo', 'Total de Reservas');
				body.push(...reports.map(report => [report.field_id ?? 0, report.total_reservations ?? 0]));
				break;
			default:
				break;
		}

		autoTable(doc, {
			startY: 30,
			head: [head],
			body: body,
		});

		doc.save('reports.pdf');
	};

	const exportToExcel = (reports: IReport[]) => {
		const worksheet = XLSX.utils.json_to_sheet(reports);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
		XLSX.writeFile(workbook, 'reports.xlsx');
	};

	const renderReportCard = (report: IReport, index: number) => {
		switch (reportType) {
			case 'performance':
				return (
					<div
						key={index}
						className='bg-white shadow-md rounded-lg p-4 mb-4'
					>
						<p className='font-bold'>Data: {report.date}</p>
						<p>Total de Reservas: {report.total_reservations}</p>
					</div>
				);
			case 'financial':
				return (
					<div
						key={index}
						className='bg-white shadow-md rounded-lg p-4 mb-4'
					>
						<p className='font-bold'>Data: {report.date}</p>
						<p>Valor Total: {report.total_amount}</p>
						<p>Total de Transações: {report.total_transactions}</p>
					</div>
				);
			case 'users':
				return (
					<div
						key={index}
						className='bg-white shadow-md rounded-lg p-4 mb-4'
					>
						<p className='font-bold'>Data: {report.date}</p>
						<p>Total de Usuários: {report.total_users}</p>
					</div>
				);
			case 'occupancy':
				return (
					<div
						key={index}
						className='bg-white shadow-md rounded-lg p-4 mb-4'
					>
						<p className='font-bold'>ID do Campo: {report.field_id}</p>
						<p>Total de Reservas: {report.total_reservations}</p>
					</div>
				);
			default:
				return null;
		}
	};

	const renderChartData = () => {
		const labels = reports.map(report => report.date);
		const data = (() => {
			switch (reportType) {
				case 'performance':
					return reports.map(report => report.total_reservations);
				case 'financial':
					return reports.map(report => parseFloat(report.total_amount ?? '0'));
				case 'users':
					return reports.map(report => report.total_users);
				case 'occupancy':
					return reports.map(report => report.total_reservations);
				default:
					return [];
			}
		})();

		return {
			labels,
			datasets: [
				{
					label: `Relatório de ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`,
					data,
					fill: false,
					backgroundColor: 'rgba(75,192,192,0.2)',
					borderColor: 'rgba(75,192,192,1)',
					borderWidth: 1,
				},
			],
		};
	};

	return (
		<Sidebar>
			<div className='container mx-auto p-4'>
				<h1 className='text-3xl font-bold mb-4'>Relatórios</h1>
				<div className='mb-4'>
					<label className='mr-2'>Tipo de Relatório:</label>
					<select
						value={reportType}
						onChange={e => handleReportTypeChange(e.target.value)}
						className='border border-gray-300 rounded-lg p-2'
					>
						<option value='performance'>Performance</option>
						<option value='financial'>Financeiro</option>
						<option value='users'>Usuários</option>
						<option value='occupancy'>Ocupação</option>
					</select>
				</div>
				<form
					onSubmit={handleSubmit}
					className='mb-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'
				>
					<input
						type='date'
						name='start_date'
						className='input input-bordered p-2 border border-gray-300 rounded-lg w-full md:w-auto'
						value={startDate}
						onChange={e => setStartDate(e.target.value)}
						required
					/>
					<input
						type='date'
						name='end_date'
						className='input input-bordered p-2 border border-gray-300 rounded-lg w-full md:w-auto'
						value={endDate}
						onChange={e => setEndDate(e.target.value)}
						required
					/>
					<button
						type='submit'
						className='btn btn-primary bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full md:w-auto'
					>
						Filtrar
					</button>
				</form>
				<div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-4'>
					<button
						onClick={() => exportToPDF(reports, reportType)}
						className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full md:w-auto'
					>
						Exportar para PDF
					</button>
					<button
						onClick={() => exportToExcel(reports)}
						className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full md:w-auto'
					>
						Exportar para Excel
					</button>
				</div>
				{loading ?
					<p>Carregando...</p>
				:	<>
						<div className='block md:hidden'>{reports.map((report, index) => renderReportCard(report, index))}</div>
						<div className='hidden md:block'>
							<div className='overflow-x-auto'>
								<table className='min-w-full bg-white'>
									<thead className='bg-gray-200'>
										{reportType === 'performance' && (
											<tr>
												<th className='py-2 px-4'>Data</th>
												<th className='py-2 px-4'>Total de Reservas</th>
											</tr>
										)}
										{reportType === 'financial' && (
											<tr>
												<th className='py-2 px-4'>Data</th>
												<th className='py-2 px-4'>Valor Total</th>
												<th className='py-2 px-4'>Total de Transações</th>
											</tr>
										)}
										{reportType === 'users' && (
											<tr>
												<th className='py-2 px-4'>Data</th>
												<th className='py-2 px-4'>Total de Usuários</th>
											</tr>
										)}
										{reportType === 'occupancy' && (
											<tr>
												<th className='py-2 px-4'>ID do Campo</th>
												<th className='py-2 px-4'>Total de Reservas</th>
											</tr>
										)}
									</thead>
									<tbody>
										{reports.map((report, index) => (
											<tr key={index}>
												{reportType === 'performance' && (
													<>
														<td className='border px-4 py-2'>{report.date}</td>
														<td className='border px-4 py-2'>{report.total_reservations}</td>
													</>
												)}
												{reportType === 'financial' && (
													<>
														<td className='border px-4 py-2'>{report.date}</td>
														<td className='border px-4 py-2'>{report.total_amount}</td>
														<td className='border px-4 py-2'>{report.total_transactions}</td>
													</>
												)}
												{reportType === 'users' && (
													<>
														<td className='border px-4 py-2'>{report.date}</td>
														<td className='border px-4 py-2'>{report.total_users}</td>
													</>
												)}
												{reportType === 'occupancy' && (
													<>
														<td className='border px-4 py-2'>{report.field_id}</td>
														<td className='border px-4 py-2'>{report.total_reservations}</td>
													</>
												)}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
						<div className='flex justify-center items-center my-4 space-x-4'>
							<button
								onClick={() => setPage(page - 1)}
								disabled={page === 1}
								className={`${page === 1 ? 'bg-gray-500 hover:bg-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} px-4 py-2 text-white rounded-lg`}
							>
								&laquo;
							</button>
							<span className='mx-2'>
								{page} de {totalPages}
							</span>
							<button
								onClick={() => setPage(page + 1)}
								disabled={page === totalPages}
								className={`${page === totalPages ? 'bg-gray-500 hover:bg-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} px-4 py-2 text-white rounded-lg`}
							>
								&raquo;
							</button>
						</div>
						<div className='mt-8'>
							<Line data={renderChartData()} />
						</div>
					</>
				}
			</div>
		</Sidebar>
	);
};

export default Reports;
