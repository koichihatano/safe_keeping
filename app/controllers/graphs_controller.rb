class GraphsController < ApplicationController
  def index
    gon.yen_records = Graph.chart_data(current_user)
  end
end
