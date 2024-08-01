import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { IReport } from '../../../interfaces/IReport';
import Sidebar from '../../../components/common/Sidebar';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { FaFilePdf, FaFileExcel, FaFilter, FaSync } from 'react-icons/fa';

const Reports = () => {
	const { token } = useAuth();
	const [reports, setReports] = useState<IReport[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [reportType, setReportType] = useState('performance');
	const [startDate, setStartDate] = useState(() => {
		const date = new Date();
		date.setDate(date.getDate() - 30);
		return date.toISOString().split('T')[0];
	});
	const [endDate, setEndDate] = useState(() => {
		const date = new Date();
		return date.toISOString().split('T')[0];
	});
	const [filters, setFilters] = useState<{ start_date: string; end_date: string }>({
		start_date: startDate,
		end_date: endDate,
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
		const formatDateToLocale = (dateString: string) => {
			const [year, month, day] = dateString.split('-').map(Number);
			return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
		};
		return (
			<div
				key={index}
				className='bg-white shadow-lg rounded-lg p-4 mx-4 my-4 border border-gray-200 transition-transform hover:scale-105'
			>
				<h4 className='font-bold text-center mb-2'>{report?.date ? formatDateToLocale(report?.date) : ''}</h4>
				<ul>
					{reportType === 'performance' && <li>Total de Reservas: {report.total_reservations}</li>}
					{reportType === 'financial' && (
						<>
							<li>Valor Total: R$ {report.total_amount}</li>
							<li>Total de Transações: {report.total_transactions}</li>
						</>
					)}
					{reportType === 'users' && <li>Total de Usuários: {report.total_users}</li>}
					{reportType === 'occupancy' && (
						<>
							<li>ID do Campo: {report.field_id}</li>
							<li>Nome do Campo: {report.field_name}</li>
							<li>Total de Reservas: {report.total_reservations}</li>
						</>
					)}
				</ul>
			</div>
		);
	};

	const renderChartData = () => {
		const labels = reports.map(report => new Date(report.date).toLocaleDateString('pt-BR'));
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

		const reportTypePtBr = (() => {
			switch (reportType) {
				case 'performance':
					return 'Performance';
				case 'financial':
					return 'Financeiro';
				case 'users':
					return 'Usuários';
				case 'occupancy':
					return 'Ocupação';
				default:
					return '';
			}
		})();

		return {
			labels,
			datasets: [
				{
					label: `Relatório de ${reportTypePtBr}`,
					data,
					fill: false,
					backgroundColor: 'rgba(75,192,192,0.4)',
					borderColor: 'rgba(75,192,192,1)',
					borderWidth: 2,
				},
			],
		};
	};

	return (
		<Sidebar>
			<div className='container mx-auto p-6'>
				<h1 className='text-4xl font-bold text-center mb-8'>Relatórios</h1>
				<div className='flex flex-col items-center mb-6'>
					<div className='flex items-center space-x-4 mb-4'>
						<label className='flex items-center space-x-2'>
							<FaFilter className='text-gray-600' />
							<span className='text-lg font-medium'>Tipo de Relatório:</span>
						</label>
						<select
							value={reportType}
							onChange={e => handleReportTypeChange(e.target.value)}
							className='border border-gray-300 rounded-lg p-2 shadow-sm focus:ring focus:ring-blue-200 transition'
						>
							<option value='performance'>Performance</option>
							<option value='financial'>Financeiro</option>
							<option value='users'>Usuários</option>
							<option value='occupancy'>Ocupação</option>
						</select>
					</div>
					<form
						onSubmit={handleSubmit}
						className='flex flex-col md:flex-row items-center md:items-end space-y-2 md:space-y-0 md:space-x-4'
					>
						<div className='flex flex-col'>
							<label
								htmlFor='start_date'
								className='text-sm text-gray-600 mb-1'
							>
								Data de Início
							</label>
							<input
								type='date'
								name='start_date'
								className='input input-bordered p-2 border border-gray-300 rounded-lg w-full md:w-auto shadow-sm focus:ring focus:ring-blue-200 transition'
								value={startDate}
								onChange={e => setStartDate(e.target.value)}
								required
							/>
						</div>

						<div className='flex flex-col'>
							<label
								htmlFor='end_date'
								className='text-sm text-gray-600 mb-1'
							>
								Data de Fim
							</label>
							<input
								type='date'
								name='end_date'
								className='input input-bordered p-2 border border-gray-300 rounded-lg w-full md:w-auto shadow-sm focus:ring focus:ring-blue-200 transition'
								value={endDate}
								onChange={e => setEndDate(e.target.value)}
								required
							/>
						</div>
						<div className='flex items-center h-full'>
							<button
								type='submit'
								className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 shadow-lg flex items-center justify-center space-x-2 mb-1'
							>
								<FaSync />
								<span>Filtrar</span>
							</button>
						</div>
					</form>
				</div>

				<div className='flex justify-center space-x-4 mb-6'>
					<button
						onClick={() => exportToPDF(reports, reportType)}
						className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 shadow-lg flex items-center justify-center space-x-2'
					>
						<FaFilePdf />
						<span>Exportar para PDF</span>
					</button>
					<button
						onClick={() => exportToExcel(reports)}
						className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 shadow-lg flex items-center justify-center space-x-2'
					>
						<FaFileExcel />
						<span>Exportar para Excel</span>
					</button>
				</div>
				{reports && reports.length <= 0 && loading ?
					<p className='text-center text-lg'>Carregando...</p>
				:	<>
						{reports && reports.length > 0 ?
							<>
								<div className='flex flex-row justify-center items-center'>
									{reports.map((report, index) => renderReportCard(report, index))}
								</div>
								<div className='flex justify-center items-center mt-8 space-x-4'>
									<button
										onClick={() => setPage(page - 1)}
										disabled={page === 1}
										className={`${page === 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} px-4 py-2 text-white rounded-lg shadow-lg transition`}
									>
										Anterior
									</button>
									<span className='text-lg font-semibold'>
										{page} de {totalPages}
									</span>
									<button
										onClick={() => setPage(page + 1)}
										disabled={page === totalPages}
										className={`${page === totalPages ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} px-4 py-2 text-white rounded-lg shadow-lg transition`}
									>
										Próxima
									</button>
								</div>
								<div className='mt-8'>
									<Line data={renderChartData()} />
								</div>
							</>
						:	<div className='text-center'>
								<h2 className='text-lg font-semibold'>
									{reports && reports.length ? '' : 'Nenhum relatório disponível no momento.'}
								</h2>
							</div>
						}
					</>
				}
			</div>
		</Sidebar>
	);
};

export default Reports;
