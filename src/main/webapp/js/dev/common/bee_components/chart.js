/**
 * ECharts 기반 차트 모듈
 */
BeeComponents.modules.chart = function(component) {

  component.Chart = function(_props) {
    const me = this;
    return me.init(_props);
  }

  component.Chart.prototype.init = function(props) {
    const chart = echarts.init(document.getElementById(props['eId']), 'roma');
    chart.showLoading();
    chart.setOption(props['options']);
    chart.hideLoading();
    return chart;
  }

}