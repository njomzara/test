sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";

	return Controller.extend("com.benoverviewbenefitOverview.controller.View1", {
			
			table : null,
			resHost : "http://10.100.226.211:8030/",
			resHeaders : {"Authorization": "Basic " + btoa("ascerict:" + "Kalendar37")},
			
			params : {
				policyNumber : null,
				IllDate : null
			},
			
			uriInsuredPerson : "",
			uriProjectionSet : "",

			onInit: function () {
				
				var context = this;
				
				this.inptPolicyNo = this.getView().byId("inptPolicyNo");
				this.inptIllDate = this.getView().byId("inptIllDate");
				this.hBoxTxtInfo = this.getView().byId("hBoxTxtInfo");
			
				this.btnFetch = this.getView().byId("btnFetch");
				this.tableProjection = this.getView().byId("tableProjection");
				
				this.hBoxInsuredData = this.getView().byId("hBoxInsuredData");
				this.hBoxProjectonSet = this.getView().byId("hBoxProjectonSet");
				
				this.jmProjectionSet = new sap.ui.model.json.JSONModel();
				this.jmInsuedPerson = new sap.ui.model.json.JSONModel();
				
				this.jmProjectionSet.attachRequestCompleted(function(data) {
					context.getView().setModel(context.jmProjectionSet, "projectionModel");
					context.jmInsuedPerson.loadData(context.uriInsuredPerson, null, true, "GET", null, false, context.resHeaders);	
				}); 
				
				this.jmInsuedPerson.attachRequestCompleted(function(event) {
					
					context.getView().setModel(context.jmInsuedPerson, "insuredModel");
   	    			sap.ui.core.BusyIndicator.hide();
					context.hBoxInsuredData.setVisible(true);
					context.hBoxProjectonSet.setVisible(true); 
				
		   	    });
		   	    
				this.jmProjectionSet.attachRequestFailed(function(data) {
					setTimeout(function(){
						sap.ui.core.BusyIndicator.hide();
						context.hBoxInsuredData.setVisible(false);
						context.hBoxProjectonSet.setVisible(false); 
						MessageToast.show("oData Service error!"); }, 500);
					
				});
				
				this.jmInsuedPerson.attachRequestFailed(function(data) {
					setTimeout(function(){
						sap.ui.core.BusyIndicator.hide();
						context.hBoxInsuredData.setVisible(false);
						context.hBoxProjectonSet.setVisible(false); 
						MessageToast.show("oData Service error!"); }, 500);
				});
				
				this.tableProjection.setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Auto);
				
				this.getView().byId("multiheader1").setHeaderSpan([3,1,1]);
				this.getView().byId("multiheader2").setHeaderSpan([4,1,1,1]);
				
			},
			
			fetchList: function (context) {
				
				if(this.hBoxTxtInfo.getVisible()){
					this.hBoxTxtInfo.setVisible(false);
				}
				
				if(this.hBoxInsuredData.getVisible()){
					this.hBoxInsuredData.setVisible(false);
				}

				if(this.tableProjection.getVisible()){
					this.hBoxProjectonSet.setVisible(false);
				}	
								
				sap.ui.core.BusyIndicator.show(0);
				
				this.params.policyNumber = this.inptPolicyNo.getValue();
				this.params.IllDate = this.inptIllDate.getValue();
				
				this.uriInsuredPerson = this.resHost +
									    "sap/opu/odata/sap/ZPM_MODEL_CALCULATION_SRV/InsuredPersonSet('" +
									    this.params.policyNumber +
									    "')?$format=json";
									   
				this.uriProjectionSet = this.resHost +
									    "sap/opu/odata/sap/ZPM_MODEL_CALCULATION_SRV/ProjectionSet?$filter=" +
									    "PolicyNr eq '" + this.params.policyNumber + "' and " +
									    "IllustrationDt eq datetime'" + this.params.IllDate + "T00:00:00'" +
										"&$format=json";
			
			   	this.jmProjectionSet.loadData(this.uriProjectionSet, null, true, "GET", null, false, this.resHeaders);
			   
			}
			
	});
	
});