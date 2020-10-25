class CreateGraphs < ActiveRecord::Migration[6.0]
  def change
    create_table :graphs do |t|
      t.date :date
      t.integer :yen
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  
    add_index :graphs, [:user_id, :date], unique: true
  end
end
